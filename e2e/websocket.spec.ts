import { expect, test, type APIRequestContext } from "@playwright/test";
import { e2eEnv } from "../tooling/e2e-env";

const gatewayUrl = "http://localhost:8000";
const websocketUrl = "ws://localhost:8000/ws";

async function fetchAccessToken(request: APIRequestContext, username: string): Promise<string> {
  const tokenResponse = await request.post(
    `${e2eEnv.KC_URL}/realms/${e2eEnv.KC_REALM}/protocol/openid-connect/token`,
    {
      form: {
        grant_type: "password",
        client_id: e2eEnv.KC_CLIENT_ID,
        client_secret: e2eEnv.KC_CLIENT_SECRET,
        username,
        password: e2eEnv.USER_PASSWORD,
      },
    },
  );
  expect(tokenResponse.ok()).toBe(true);
  const body = (await tokenResponse.json()) as { access_token: string };
  return body.access_token;
}

async function directConversationId(
  request: APIRequestContext,
  accessToken: string,
  excludedParticipantId?: string,
): Promise<string> {
  const response = await request.post(`${gatewayUrl}/graphql`, {
    headers: { cookie: `access_token=${accessToken}` },
    data: {
      query:
        "query { conversations { id type channel participants { userId } } }",
    },
  });
  expect(response.ok()).toBe(true);
  const body = (await response.json()) as {
    data?: {
      conversations?: Array<{
        id: string;
        type: string;
        channel: string;
        participants: Array<{ userId: string }>;
      }>;
    };
  };
  const conversation = body.data?.conversations?.find(
    (candidate) =>
      candidate.type === "DIRECT" &&
      candidate.channel === "IN_APP" &&
      !candidate.participants.some(({ userId }) => userId === excludedParticipantId),
  );
  expect(conversation).toBeDefined();
  return conversation!.id;
}

function jwtSubject(token: string): string {
  const payload = token.split(".")[1];
  if (!payload) throw new Error("Access token has no payload");
  return (JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { sub: string }).sub;
}

test("graphql-transport-ws answers wsPing and accepts an HttpOnly-cookie subscription", async ({
  context,
  page,
  request,
}) => {
  const accessToken = await fetchAccessToken(
    request,
    e2eEnv.USER_USERNAME,
  );
  const conversationId = await directConversationId(request, accessToken);

  await context.addCookies([
    {
      name: "access_token",
      value: accessToken,
      url: gatewayUrl,
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
  await page.goto(`${gatewayUrl}/health/liveness`);

  const result = await page.evaluate(
    ({ url, conversationId }) =>
      new Promise<{ ping: string; authenticatedSubscription: boolean }>((resolve, reject) => {
        const socket = new WebSocket(url, "graphql-transport-ws");
        const timeout = window.setTimeout(() => {
          socket.close();
          reject(new Error("WebSocket test timed out"));
        }, 5_000);
        let ping = "";
        let subscriptionTimer: number | undefined;

        const finish = () => {
          window.clearTimeout(timeout);
          socket.send(JSON.stringify({ id: "auth", type: "complete" }));
          socket.close(1000);
          resolve({ ping, authenticatedSubscription: true });
        };

        socket.onerror = () => reject(new Error("WebSocket connection failed"));
        socket.onopen = () => socket.send(JSON.stringify({ type: "connection_init" }));
        socket.onmessage = ({ data }) => {
          const message = JSON.parse(String(data)) as {
            id?: string;
            type: string;
            payload?: { data?: { wsPing?: string }; errors?: unknown };
          };
          if (message.type === "connection_ack") {
            socket.send(
              JSON.stringify({
                id: "ping",
                type: "subscribe",
                payload: { query: "query { wsPing }" },
              }),
            );
            return;
          }
          if (message.id === "ping" && message.type === "next") {
            ping = message.payload?.data?.wsPing ?? "";
            socket.send(
              JSON.stringify({
                id: "auth",
                type: "subscribe",
                payload: {
                  query:
                    "subscription MessageReceived($conversationId: ID!) { messageReceived(conversationId: $conversationId) { id } }",
                  variables: { conversationId },
                },
              }),
            );
            subscriptionTimer = window.setTimeout(finish, 500);
            return;
          }
          if (message.id === "auth" && message.type === "error") {
            if (subscriptionTimer !== undefined) window.clearTimeout(subscriptionTimer);
            reject(new Error(`Authenticated subscription rejected: ${JSON.stringify(message.payload)}`));
          }
        };
      }),
    { url: websocketUrl, conversationId },
  );

  expect(result).toEqual({ ping: "ok", authenticatedSubscription: true });
});

test("a non-participant cannot list or subscribe to another DIRECT conversation", async ({
  context,
  page,
  request,
}) => {
  const calebToken = await fetchAccessToken(request, "caleb");
  const outsiderToken = await fetchAccessToken(request, "rachel");
  const conversationId = await directConversationId(
    request,
    calebToken,
    jwtSubject(outsiderToken),
  );

  const outsiderConversations = await request.post(`${gatewayUrl}/graphql`, {
    headers: { cookie: `access_token=${outsiderToken}` },
    data: { query: "query { conversations { id } }" },
  });
  const outsiderBody = (await outsiderConversations.json()) as {
    data?: { conversations?: Array<{ id: string }> };
  };
  expect(outsiderBody.data?.conversations ?? []).not.toContainEqual({ id: conversationId });

  await context.addCookies([
    {
      name: "access_token",
      value: outsiderToken,
      url: gatewayUrl,
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
  await page.goto(`${gatewayUrl}/health/liveness`);

  const rejection = await page.evaluate(
    ({ url, conversationId }) =>
      new Promise<string>((resolve, reject) => {
        const socket = new WebSocket(url, "graphql-transport-ws");
        const timeout = window.setTimeout(() => {
          socket.close();
          reject(new Error("Outsider subscription was not rejected"));
        }, 5_000);
        socket.onerror = () => reject(new Error("WebSocket connection failed"));
        socket.onopen = () => socket.send(JSON.stringify({ type: "connection_init" }));
        socket.onmessage = ({ data }) => {
          const message = JSON.parse(String(data)) as {
            id?: string;
            type: string;
            payload?:
              | Array<{ message?: string }>
              | { errors?: Array<{ message?: string }>; data?: unknown };
          };
          if (message.type === "connection_ack") {
            socket.send(
              JSON.stringify({
                id: "forbidden",
                type: "subscribe",
                payload: {
                  query:
                    "subscription MessageReceived($conversationId: ID!) { messageReceived(conversationId: $conversationId) { id } }",
                  variables: { conversationId },
                },
              }),
            );
          }
          const errors = Array.isArray(message.payload)
            ? message.payload
            : message.payload?.errors;
          if (message.id === "forbidden" && errors?.length) {
            window.clearTimeout(timeout);
            socket.close(1000);
            resolve(errors[0]?.message ?? "");
          }
        };
      }),
    { url: websocketUrl, conversationId },
  );

  expect(rejection).toContain("access denied");
});

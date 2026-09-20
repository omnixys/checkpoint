import { expect, test, type APIRequestContext } from "@playwright/test";
import { e2eEnv } from "../tooling/e2e-env";

const appUrl = "http://localhost:3000";
const communicationGatewayUrl = "http://localhost:7410";

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name} for WhatsApp support E2E`);
  return value;
}

async function sendEvolutionWebhook(
  request: APIRequestContext,
  apiKey: string,
  instance: string,
  messageId: string,
  remoteJid: string,
  senderName: string,
  body: string,
): Promise<void> {
  const response = await request.post(`${communicationGatewayUrl}/webhooks/evolution`, {
    headers: { apikey: apiKey },
    data: {
      event: "messages.upsert",
      instance,
      data: {
        key: { id: messageId, remoteJid },
        pushName: senderName,
        message: { conversation: body },
        messageType: "conversation",
      },
    },
  });
  expect(response.ok()).toBe(true);
}

test("WhatsApp inbound appears in event support and updates live", async ({
  context,
  page,
  request,
}) => {
  const apiKey = requiredEnvironment("EVOLUTION_API_KEY");
  const eventId = requiredEnvironment("WHATSAPP_SUPPORT_EVENT_ID");
  const instance = process.env.EVOLUTION_INSTANCE_NAME?.trim() || "dev";
  const staffUsername = process.env.WHATSAPP_SUPPORT_USERNAME?.trim() || "caleb";
  const runId = String(Date.now());
  const remoteJid = `491590${runId.slice(-7)}@s.whatsapp.net`;
  const senderName = `WhatsApp E2E ${runId.slice(-5)}`;
  const bootstrapBody = `Bootstrap ${runId}`;
  const liveBody = `Live ${runId}`;

  await sendEvolutionWebhook(
    request,
    apiKey,
    instance,
    `${runId}-bootstrap`,
    remoteJid,
    senderName,
    bootstrapBody,
  );

  await context.addInitScript((selectedEventId) => {
    window.localStorage.setItem("checkpoint.activeEventId", selectedEventId);
    window.localStorage.setItem("checkpoint.onboardingDone", "done");
  }, eventId);

  await page.goto(`${appUrl}/login`);
  const loggedIn = await page.evaluate(
    async ({ username, password }) => {
      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationName: "Login",
          query: `mutation Login($input: LogInInput!) {
            credentialsLogin(input: $input) {
              accessToken
              expiresIn
              refreshToken
            }
          }`,
          variables: { input: { username, password } },
        }),
      });
      const result = (await response.json()) as {
        data?: { credentialsLogin?: { accessToken?: string } };
        errors?: unknown;
      };
      return Boolean(!result.errors && result.data?.credentialsLogin?.accessToken);
    },
    { username: staffUsername, password: e2eEnv.USER_PASSWORD },
  );
  expect(loggedIn).toBe(true);

  await page.goto(appUrl);
  await expect(page.getByText("Profile", { exact: true })).toBeVisible();
  await page.goto(`${appUrl}/event/${eventId}`);
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("checkpoint.activeEventId")))
    .toBe(eventId);
  await page.goto(`${appUrl}/event/${eventId}/support`);
  const closeOnboarding = page.getByRole("button", { name: "Close" });
  if (await closeOnboarding.isVisible()) await closeOnboarding.click();
  const declineAnalytics = page.getByRole("button", { name: "Decline" });
  if (await declineAnalytics.isVisible()) await declineAnalytics.click();
  await expect(page.getByText("Support Center", { exact: true })).toBeVisible();
  await page.getByText("WhatsApp", { exact: true }).first().click();
  await expect(page.getByText(senderName, { exact: true })).toBeVisible();
  await page.getByText(senderName, { exact: true }).click();
  await expect(page.getByText(bootstrapBody, { exact: true })).toBeVisible();

  await sendEvolutionWebhook(
    request,
    apiKey,
    instance,
    `${runId}-live`,
    remoteJid,
    senderName,
    liveBody,
  );

  await expect(page.getByText(liveBody, { exact: true }).last()).toBeVisible({ timeout: 10_000 });
});

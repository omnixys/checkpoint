import { getAuthContext } from "@/checkpoint/lib/apollo/auth-context";
import { env } from "@/checkpoint/lib/env";
import { getLogger } from "@/checkpoint/utils/logger";
import { ApolloLink, Observable } from "@apollo/client";
import { Client, createClient } from "graphql-ws";

/**
 * WebSocket link for GraphQL subscriptions.
 */
export function createWsLinkWithAuth(getToken: () => string | null): ApolloLink | null {
  if (typeof window === "undefined") {
    return null;
  }

  const logger = getLogger("ApolloWS");
  const wsUrl = env.BACKEND_WS_URL;

  const client: Client = createClient({
    url: wsUrl,
    lazy: true,
    retryAttempts: Infinity,

    /**
     * Correct type: must return Promise<void>
     */
    retryWait: async (retries: number) => {
      const delay = Math.min(1000 * retries, 5000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    },

    /**
     * Inject token manually (cookies are not sent automatically)
     */
    connectionParams: () => {
      const token = getToken();
      const context = getAuthContext();

      return {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "x-tenant-id": context.tenantId,
        ...(context.actorId ? { "x-actor-id": context.actorId } : {}),
      };
    },

    on: {
      connected: () => logger.debug("WS connected"),
      closed: (event) => logger.warn("WS closed", event),
      error: (err) => logger.error("WS error", err),
    },
  });

  return new ApolloLink((operation) => {
    return new Observable((sink) => {
      const dispose = client.subscribe(
        {
          ...operation,
          query: operation.query.loc?.source.body ?? "",
        },
        {
          next: sink.next.bind(sink),
          error: sink.error.bind(sink),
          complete: sink.complete.bind(sink),
        },
      );

      return () => dispose();
    });
  });
}

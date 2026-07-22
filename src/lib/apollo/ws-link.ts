import { ApolloLink, Observable } from "@apollo/client";
import { print } from "graphql";
import { type Client, createClient } from "graphql-ws";
import { getAuthContext } from "@/checkpoint/lib/apollo/auth-context";
import { env } from "@/checkpoint/lib/env";
import { getLogger } from "@/checkpoint/utils/logger";

export function createWsLinkWithAuth(): ApolloLink | null {
  if (typeof window === "undefined") {
    return null;
  }

  const logger = getLogger("ApolloWS");

  const client: Client = createClient({
    url: env.BACKEND_WS_URL,
    lazy: true,
    retryAttempts: Number.POSITIVE_INFINITY,

    retryWait: async (retries) => {
      const delay = Math.min(1000 * retries, 5000);
      logger.debug("WS retry wait", { retries, delay });

      await new Promise((r) => setTimeout(r, delay));
    },

    connectionParams: () => {
      const ctx = getAuthContext();

      const params = {
        "x-tenant-id": ctx.tenantId,
        ...(ctx.actorId ? { "x-actor-id": ctx.actorId } : {}),
      };

      logger.debug("WS connectionParams ready", {
        hasTenantId: Boolean(ctx.tenantId),
        hasActorId: Boolean(ctx.actorId),
      });

      return params;
    },

    on: {
      connected: () => logger.debug("WS connected"),
      closed: (e) => logger.warn("WS closed", e),
      error: (e) => logger.error("WS error", e),
    },
  });

  return new ApolloLink((operation) => {
    return new Observable((sink) => {
      logger.debug("WS SUBSCRIBE START", {
        operationName: operation.operationName,
        variables: operation.variables,
      });

      const dispose = client.subscribe(
        {
          query: print(operation.query),
          variables: operation.variables,
        },
        {
          next: (value) => {
            /**
             * 🔥 LOG RAW EVENT
             */
            logger.debug("WS RAW EVENT", value);

            /**
             * 🔥 FIX TYPES (exactOptionalPropertyTypes)
             */
            const normalized = {
              ...value,
              errors: value.errors ?? [], // ✅ ensure always array
            };

            logger.debug("WS NORMALIZED EVENT", normalized);

            sink.next(normalized as any);
          },

          error: (err) => {
            logger.error("WS SUB ERROR", err);
            sink.error(err);
          },

          complete: () => {
            logger.debug("WS COMPLETE");
            sink.complete();
          },
        },
      );

      return () => {
        logger.debug("WS UNSUBSCRIBE");
        dispose();
      };
    });
  });
}

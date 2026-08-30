import type { ApolloLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { type Client, createClient } from "graphql-ws";
import { getAuthContext } from "@/checkpoint/lib/apollo/auth-context";
import { env } from "@/checkpoint/lib/env";
import { getLogger } from "@/checkpoint/utils/logger";

export type RealtimeStatus = "connecting" | "connected" | "reconnecting" | "offline";

let status: RealtimeStatus = "offline";
let hasConnected = false;
let restartSocket: (() => void) | null = null;
const listeners = new Set<() => void>();

function setStatus(next: RealtimeStatus): void {
  if (status === next) return;
  status = next;
  for (const listener of listeners) listener();
}

export function getRealtimeStatus(): RealtimeStatus {
  return status;
}

export function subscribeRealtimeStatus(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function restartWebSocketTransport(): void {
  restartSocket?.();
}

export function createWsLinkWithAuth(): ApolloLink | null {
  if (typeof window === "undefined") return null;

  const logger = getLogger("ApolloWS");
  const client: Client = createClient({
    url: env.BACKEND_WS_URL,
    lazy: true,
    retryAttempts: Number.POSITIVE_INFINITY,
    retryWait: async (retries) => {
      const delay = Math.min(500 * 2 ** Math.min(retries, 4), 5000);
      setStatus("reconnecting");
      await new Promise((resolve) => setTimeout(resolve, delay));
    },
    connectionParams: () => {
      const context = getAuthContext();
      return {
        "x-tenant-id": context.tenantId,
        ...(context.actorId ? { "x-actor-id": context.actorId } : {}),
      };
    },
    on: {
      connecting: () => setStatus(hasConnected ? "reconnecting" : "connecting"),
      opened: (socket) => {
        restartSocket = () => {
          if (
            socket &&
            typeof socket === "object" &&
            "close" in socket &&
            typeof socket.close === "function"
          ) {
            socket.close(4205, "Client Restart");
          }
        };
      },
      connected: () => {
        hasConnected = true;
        setStatus("connected");
        logger.debug("WS connected");
      },
      closed: (event) => {
        const code =
          event && typeof event === "object" && "code" in event && typeof event.code === "number"
            ? event.code
            : 0;
        const reason =
          event &&
          typeof event === "object" &&
          "reason" in event &&
          typeof event.reason === "string"
            ? event.reason
            : "";
        restartSocket = null;
        setStatus(code === 1000 ? "offline" : "reconnecting");
        logger.warn("WS closed", { code, reason });
      },
      error: (error) => {
        setStatus("reconnecting");
        logger.error("WS error", error);
      },
    },
  });

  return new GraphQLWsLink(client);
}

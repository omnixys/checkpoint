import { ApolloLink, HttpLink, Observable } from "@apollo/client";
import { getAuthContext } from "@/checkpoint/lib/apollo/auth-context";
import { env } from "@/checkpoint/lib/env";
import { getLogger } from "@/checkpoint/utils/logger";
import { generateUUID } from "@/checkpoint/utils/ticket/device-utils";
import { createAppErrorLink } from "./error-link";

/**
 * HTTP link with cookie-based auth.
 *
 * Cookies are automatically sent via `credentials: include`.
 * Authorization header is only added for SSR consistency.
 */
export function createHttpLinkWithMiddleware(getToken: () => string | null): ApolloLink {
  const logger = getLogger("ApolloHTTP");

  const uri = env.BACKEND_SERVER_URL;

  const errorLink = createAppErrorLink();

  /**
   * Auth Link (important for SSR)
   */
  const authLink = new ApolloLink((operation, forward) => {
    const token = getToken();
    const context = getAuthContext();
    const prevContext = operation.getContext();

    const requestId = generateUUID();
    const headers = {
      ...(prevContext.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "x-tenant-id": context.tenantId,
      ...(context.actorId ? { "x-actor-id": context.actorId } : {}),
      "x-request-id": requestId,
      "x-correlation-id": requestId,
      "x-device": "web",
      "x-platform": "checkpoint",
      "x-client-version": "1.0.0",
    };

    operation.setContext({
      ...prevContext,
      headers,
      omnixys: { requestId, correlationId: requestId },
    });

    return forward(operation);
  });
  /**
   * Logging + Error handling
   */
  const loggingLink = new ApolloLink((operation, forward) => {
    const start = Date.now();

   console.log("[HTTP] →", {
      operation: operation.operationName,
      requestId: operation.getContext().omnixys?.requestId,
      variables: operation.variables
    });

    return new Observable((observer) => {
      const sub = forward(operation).subscribe({
        next: (result) => {
         console.log("[HTTP] ←", {
            operation: operation.operationName,
            durationMs: Date.now() - start,
            requestId: operation.getContext().omnixys?.requestId,
            value: result,
          });

          observer.next(result);
        },
        error: (error) => {
          logger.error("[HTTP ERROR]", {
            operation: operation.operationName,
            durationMs: Date.now() - start,
            requestId: operation.getContext().omnixys?.requestId,
          });

          observer.error(error);
        },
        complete: () => observer.complete(),
      });

      return () => sub.unsubscribe();
    });
  });

  /**
   * HTTP transport
   */
  const httpLink = new HttpLink({
    uri,
    credentials: "include",
  });

  return ApolloLink.from([errorLink, authLink, loggingLink, httpLink]);
}

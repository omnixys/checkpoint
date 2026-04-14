import { getAuthContext } from "@/checkpoint/lib/apollo/auth-context";
import { env } from "@/checkpoint/lib/env";
import { getLogger } from "@/checkpoint/utils/logger";
import { generateUUID } from "@/checkpoint/utils/ticket/device-utils";
import { ApolloLink, HttpLink, Observable } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";

/**
 * HTTP link with cookie-based auth.
 *
 * Cookies are automatically sent via `credentials: include`.
 * Authorization header is only added for SSR consistency.
 */
export function createHttpLinkWithMiddleware(getToken: () => string | null): ApolloLink {
  const logger = getLogger("ApolloHTTP");

  const uri = env.BACKEND_SERVER_URL;

  /**
   * ErrorLink (Apollo v4 compliant)
   *
   * Why:
   * - onError is deprecated
   * - this is the official replacement
   */
  const errorLink = new ErrorLink(({ error, operation }) => {
    /**
     * Detect raw network failure (backend unreachable / CORS)
     */
    const isNetworkFailure = error instanceof TypeError && error.message === "Failed to fetch";

    if (isNetworkFailure) {
      logger.error("[NETWORK ERROR]", {
        message: "Backend unreachable",
        operation: operation.operationName,
        uri,
      });
      /**
       * Redirect to dedicated error page (client only)
       */
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        /**
         * Prevent redirect loops:
         * - Do not redirect if already on error page
         * - Only redirect once
         */
        const isErrorPage = currentPath.startsWith("/error");

        if (!isErrorPage) {
          window.location.href = "/error/network-error";
        }
      }

      return;
    }

    /**
     * APOLLO NETWORK ERROR (has response)
     */
    const networkError = (error as any)?.networkError;
    const statusCode = networkError?.statusCode;

    /**
     * 401 → session expired → login
     */
    if (statusCode === 401) {
      logger.warn("[401 UNAUTHORIZED]", {
        operation: operation.operationName,
      });

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return;
    }

    /**
     * 403 → forbidden
     */
    if (statusCode === 403) {
      logger.warn("[403 FORBIDDEN]", {
        operation: operation.operationName,
      });

      if (typeof window !== "undefined") {
        window.location.href = "/error/forbidden";
      }

      return;
    }

    /**
     * 429 → rate limit
     */
    if (statusCode === 429) {
      logger.warn("[429 RATE LIMIT]", {
        operation: operation.operationName,
      });

      if (typeof window !== "undefined") {
        window.location.href = "/error/rate-limit";
      }

      return;
    }
  });

  /**
   * Auth Link (important for SSR)
   */
  const authLink = new ApolloLink((operation, forward) => {
    const token = getToken();
    const context = getAuthContext();
    const prevContext = operation.getContext();

    const headers = {
      ...(prevContext.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "x-tenant-id": context.tenantId,
      ...(context.actorId ? { "x-actor-id": context.actorId } : {}),
      "x-request-id": generateUUID(),
      "x-device": "web",
      "x-platform": "checkpoint",
      "x-client-version": "1.0.0",
    };

    operation.setContext({
      ...prevContext,
      headers,
    });

    return forward(operation);
  });
  /**
   * Logging + Error handling
   */
  const loggingLink = new ApolloLink((operation, forward) => {
    const start = Date.now();

    logger.debug("[HTTP] →", {
      operation: operation.operationName,
      variables: operation.variables,
    });

    return new Observable((observer) => {
      const sub = forward(operation).subscribe({
        next: (result) => {
          logger.debug("[HTTP] ←", {
            operation: operation.operationName,
            durationMs: Date.now() - start,
            result,
          });

          observer.next(result);
        },
        error: (error) => {
          logger.error("[HTTP ERROR]", {
            operation: operation.operationName,
            error,
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

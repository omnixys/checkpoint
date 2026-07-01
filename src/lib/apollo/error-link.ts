import { ErrorLink } from "@apollo/client/link/error";
import { notificationService } from "@/checkpoint/errors/notification.service";
import { getAuthContext } from "@/checkpoint/lib/apollo/auth-context";
import { getLogger } from "@/checkpoint/utils/logger";

const logger = getLogger("ApolloError");

export function handleApolloError(error: unknown, operationName?: string): void {
  const auth = getAuthContext();
  const appError = notificationService.capture(error, {
    source: "apollo",
    scope: "global",
    ...(operationName ? { operationName } : {}),
    ...(typeof window === "undefined" ? {} : { route: window.location.pathname }),
    ...(auth.actorId ? { userId: auth.actorId } : {}),
  });

  logger.error("GraphQL operation failed", appError.toLogContext());
}

export function createAppErrorLink(): ErrorLink {
  return new ErrorLink(({ error, operation }) => {
    handleApolloError(error, operation.operationName || undefined);
  });
}

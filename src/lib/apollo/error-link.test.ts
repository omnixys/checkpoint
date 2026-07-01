import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { ErrorLink } from "@apollo/client/link/error";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { notificationService } from "@/checkpoint/errors/notification.service";
import { createAppErrorLink, handleApolloError } from "./error-link";

describe("global Apollo error link", () => {
  beforeEach(() => notificationService.clear());

  it("constructs the Apollo v4 ErrorLink", () => {
    expect(createAppErrorLink()).toBeInstanceOf(ErrorLink);
  });

  it("dispatches canonical global actions with GraphQL diagnostics", () => {
    const listener = vi.fn();
    const unsubscribe = notificationService.subscribe(listener);
    const error = new CombinedGraphQLErrors({
      errors: [
        {
          message: "Session expired",
          extensions: {
            code: "REFRESH_TOKEN_EXPIRED",
            requestId: "request-refresh",
            correlationId: "correlation-refresh",
            traceId: "trace-refresh",
          },
        },
      ],
    });

    handleApolloError(error, "Refresh");

    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0]?.[0]).toMatchObject({
      error: {
        code: "REFRESH_TOKEN_EXPIRED",
        requestId: "request-refresh",
        correlationId: "correlation-refresh",
        traceId: "trace-refresh",
        operationName: "Refresh",
      },
      actions: [{ type: "dialog", dialog: "sessionExpired" }],
    });
    unsubscribe();
  });
});

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

  it("skips AbortError without capturing", () => {
    const listener = vi.fn();
    const unsubscribe = notificationService.subscribe(listener);
    const abortError = new DOMException("The operation was aborted", "AbortError");

    handleApolloError(abortError, "InternalConversations");

    expect(listener).not.toHaveBeenCalled();
    unsubscribe();
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
      actions: [{ type: "redirect", to: "/login", mode: "login-modal" }],
    });
    unsubscribe();
  });

  it("opens the login dialog for a bare Unauthorized GraphQL error", () => {
    const listener = vi.fn();
    const unsubscribe = notificationService.subscribe(listener);
    const error = new CombinedGraphQLErrors({
      errors: [{ message: "Unauthorized", extensions: { status: 401 } }],
    });

    handleApolloError(error, "InternalConversations");

    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0]?.[0].error.code).toBe("UNAUTHORIZED");
    expect(listener.mock.calls[0]?.[0]).toMatchObject({
      actions: [{ type: "redirect", to: "/login", mode: "login-modal" }],
    });
    unsubscribe();
  });

  it("does not route non-auth global errors through the login dialog", () => {
    const listener = vi.fn();
    const unsubscribe = notificationService.subscribe(listener);
    const error = new CombinedGraphQLErrors({
      errors: [{ message: "Rate limited", extensions: { code: "RATE_LIMIT_EXCEEDED" } }],
    });

    handleApolloError(error, "InternalConversations");

    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0]?.[0].actions).not.toMatchObject([
      { type: "redirect", to: "/login", mode: "login-modal" },
    ]);
    unsubscribe();
  });
});

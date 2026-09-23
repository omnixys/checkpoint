import type { ApolloClient } from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppError, ErrorCode } from "@/checkpoint/errors/app-error";
import type { ErrorNotification } from "@/checkpoint/errors/notification.service";
import { notificationService } from "@/checkpoint/errors/notification.service";
import { AuthEventsBus, AuthManager, isDefinitiveAuthFailure } from "./AuthManager";

const realtime = vi.hoisted(() => ({ restart: vi.fn() }));

vi.mock("@/checkpoint/lib/apollo/ws-link", () => ({
  restartWebSocketTransport: realtime.restart,
}));

function definitiveMembershipError(): CombinedGraphQLErrors {
  return new CombinedGraphQLErrors({
    errors: [
      {
        message: "No TenantMembership found",
        extensions: { code: "TENANT_MEMBERSHIP_NOT_FOUND", status: 403 },
      },
    ],
  });
}

describe("isDefinitiveAuthFailure", () => {
  it("treats tenant membership errors as unrecoverable", () => {
    const error = new AppError({ code: ErrorCode.TENANT_MEMBERSHIP_NOT_FOUND, message: "x" });
    expect(isDefinitiveAuthFailure(error)).toBe(true);
  });

  it("treats session errors as unrecoverable", () => {
    for (const code of [
      ErrorCode.UNAUTHORIZED,
      ErrorCode.SESSION_EXPIRED,
      ErrorCode.REFRESH_TOKEN_EXPIRED,
      ErrorCode.FORBIDDEN,
      ErrorCode.UNAUTHORIZED_TENANT,
    ]) {
      expect(isDefinitiveAuthFailure(new AppError({ code, message: "x" }))).toBe(true);
    }
  });

  it("treats 401/403 statuses as unrecoverable regardless of code", () => {
    const unauthorized = new AppError({
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: "x",
      status: 401,
    });
    const forbidden = new AppError({
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: "x",
      status: 403,
    });
    expect(isDefinitiveAuthFailure(unauthorized)).toBe(true);
    expect(isDefinitiveAuthFailure(forbidden)).toBe(true);
  });

  it("treats network and server failures as retryable", () => {
    const network = new AppError({ code: ErrorCode.NETWORK_ERROR, message: "x" });
    const server = new AppError({ code: ErrorCode.SERVICE_UNAVAILABLE, message: "x" });
    expect(isDefinitiveAuthFailure(network)).toBe(false);
    expect(isDefinitiveAuthFailure(server)).toBe(false);
  });
});

describe("AuthEventsBus.emit", () => {
  it("survives synchronous listener failures", () => {
    AuthEventsBus.on("auth:login", () => {
      throw new Error("boom");
    });

    expect(() => AuthEventsBus.emit("auth:login")).not.toThrow();
  });

  it("does not leak async listener rejections as unhandled", async () => {
    AuthEventsBus.on("auth:login", async () => {
      throw new Error("async boom");
    });

    AuthEventsBus.emit("auth:login");
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
});

describe("AuthManager recovery", () => {
  let mutate: ReturnType<typeof vi.fn>;

  function captureNotifications(): { getAll: () => ErrorNotification[]; stop: () => void } {
    const notifications: ErrorNotification[] = [];
    const unsubscribe = notificationService.subscribe((notification) =>
      notifications.push(notification),
    );
    return { getAll: () => notifications, stop: unsubscribe };
  }

  beforeEach(() => {
    mutate = vi.fn().mockResolvedValue({ data: { logout: true } });
    notificationService.clear();
    AuthManager.init({ mutate } as unknown as ApolloClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("signs out and opens the login dialog on a definitive refresh failure", async () => {
    const { getAll, stop } = captureNotifications();

    await (
      AuthManager as unknown as {
        handleRecoveryFailure: (error: unknown) => Promise<void>;
      }
    ).handleRecoveryFailure(definitiveMembershipError());
    stop();

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(getAll()).toMatchObject([
      { actions: [{ type: "redirect", to: "/login", mode: "login-modal" }] },
    ]);
  });

  it("keeps the session on transient failures", async () => {
    const { getAll, stop } = captureNotifications();

    await (
      AuthManager as unknown as {
        handleRecoveryFailure: (error: unknown) => Promise<void>;
      }
    ).handleRecoveryFailure(new TypeError("Failed to fetch"));
    stop();

    expect(mutate).not.toHaveBeenCalled();
    expect(getAll()).toEqual([]);
  });

  it("still opens the login dialog when the logout call itself fails", async () => {
    mutate.mockRejectedValue(new TypeError("Logout endpoint unreachable"));
    const { getAll, stop } = captureNotifications();

    await (
      AuthManager as unknown as {
        handleRecoveryFailure: (error: unknown) => Promise<void>;
      }
    ).handleRecoveryFailure(definitiveMembershipError());
    stop();

    expect(getAll()).toMatchObject([
      { actions: [{ type: "redirect", to: "/login", mode: "login-modal" }] },
    ]);
  });

  it("reconnects subscriptions after login, refresh, and logout cookie changes", async () => {
    mutate
      .mockResolvedValueOnce({ data: { credentialsLogin: { success: true } } })
      .mockResolvedValueOnce({ data: { refresh: { success: true } } })
      .mockResolvedValueOnce({ data: { logout: true } });

    await AuthManager.login({ username: "guest", password: "secret" });
    await AuthManager.forceRefresh();
    await AuthManager.logout();

    expect(realtime.restart).toHaveBeenCalledTimes(3);
  });

  it("requests guest magic links through the enumeration-safe mutation", async () => {
    mutate.mockResolvedValueOnce({ data: { requestGuestMagicLink: true } });

    await AuthManager.requestGuestMagicLink("guest@example.com");

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { identifier: "guest@example.com", firstName: null, lastName: null },
      }),
    );
  });

  it("forwards the full name with a phone-based magic-link request", async () => {
    mutate.mockResolvedValueOnce({ data: { requestGuestMagicLink: true } });

    await AuthManager.requestGuestMagicLink("+4915123456789", "Max", "Mustermann");

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { identifier: "+4915123456789", firstName: "Max", lastName: "Mustermann" },
      }),
    );
  });

  it("omits the name as null when it is not provided", async () => {
    mutate.mockResolvedValueOnce({ data: { requestGuestMagicLink: true } });

    await AuthManager.requestGuestMagicLink("guest@example.com", undefined, undefined);

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { identifier: "guest@example.com", firstName: null, lastName: null },
      }),
    );
  });

  it("reconnects subscriptions after magic-link verification", async () => {
    mutate.mockResolvedValueOnce({ data: { verifyMagicLink: { accessToken: "cookie-backed" } } });

    await AuthManager.verifyMagicLink("one-time-token");

    expect(realtime.restart).toHaveBeenCalledOnce();
  });
});

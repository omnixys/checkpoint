import type { ApolloClient } from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppError, ErrorCode } from "@/checkpoint/errors/app-error";
import { AuthEventsBus, AuthManager, isDefinitiveAuthFailure } from "./AuthManager";

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
  const assign = vi.fn();
  let mutate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: { assign, href: "http://localhost/" },
      writable: true,
    });
    mutate = vi.fn().mockResolvedValue({ data: { logout: true } });
    AuthManager.init({ mutate } as unknown as ApolloClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("signs out and redirects on a definitive refresh failure", async () => {
    await (
      AuthManager as unknown as {
        handleRecoveryFailure: (error: unknown) => Promise<void>;
      }
    ).handleRecoveryFailure(definitiveMembershipError());

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(assign).toHaveBeenCalledWith("/login");
  });

  it("keeps the session on transient failures", async () => {
    await (
      AuthManager as unknown as {
        handleRecoveryFailure: (error: unknown) => Promise<void>;
      }
    ).handleRecoveryFailure(new TypeError("Failed to fetch"));

    expect(mutate).not.toHaveBeenCalled();
    expect(assign).not.toHaveBeenCalled();
  });

  it("still redirects when the logout call itself fails", async () => {
    mutate.mockRejectedValue(new TypeError("Logout endpoint unreachable"));

    await (
      AuthManager as unknown as {
        handleRecoveryFailure: (error: unknown) => Promise<void>;
      }
    ).handleRecoveryFailure(definitiveMembershipError());

    expect(assign).toHaveBeenCalledWith("/login");
  });
});

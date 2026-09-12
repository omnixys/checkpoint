import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLoginForm } from "@/checkpoint/components/auth/login/useLoginForm";
import { AppError, ErrorCode } from "@/checkpoint/errors/app-error";

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  getCurrentUser: vi.fn(),
  setCurrentUser: vi.fn(),
  track: vi.fn(),
  fieldError: vi.fn(() => undefined),
  mutationError: vi.fn((error: unknown) => error as AppError),
}));

vi.mock("@/checkpoint/lib/auth/AuthManager", () => ({
  AuthManager: { login: mocks.login },
}));
vi.mock("@/checkpoint/lib/auth/get-current-user", () => ({
  getCurrentUser: mocks.getCurrentUser,
}));
vi.mock("@/checkpoint/lib/apollo/auth-context", () => ({
  setCurrentUser: mocks.setCurrentUser,
}));
vi.mock("@/checkpoint/providers/AnalyticsProvider", () => ({
  useAnalytics: () => ({ track: mocks.track }),
}));
vi.mock("@/checkpoint/hooks/error", () => ({
  useFieldError: mocks.fieldError,
  useMutationError: (_options: { operationName: string }) => mocks.mutationError,
}));

function uid(): string {
  return Math.random().toString(36).slice(2);
}

describe("useLoginForm", () => {
  beforeEach(() => vi.clearAllMocks());

  it("logs in and runs onSuccess with the fresh user", async () => {
    const user = { id: "user-1" };
    mocks.login.mockResolvedValueOnce(undefined);
    mocks.getCurrentUser.mockResolvedValueOnce(user);
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useLoginForm({ onSuccess }));

    await act(async () => {
      result.current.setUsername("ada");
      result.current.setPassword("secret");
    });
    await act(async () => {
      await result.current.submit();
    });

    expect(mocks.login).toHaveBeenCalledWith({ username: "ada", password: "secret" });
    expect(mocks.setCurrentUser).toHaveBeenCalledWith(user);
    expect(mocks.track).toHaveBeenCalledWith("LoginSucceeded");
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it("reports authentication failures without calling onSuccess", async () => {
    const appError = new AppError({
      code: ErrorCode.INVALID_CREDENTIALS,
      message: "Invalid credentials",
    });
    mocks.login.mockRejectedValueOnce(appError);
    mocks.mutationError.mockReturnValueOnce(appError);
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useLoginForm({ onSuccess }));

    await act(async () => {
      result.current.setUsername("ada");
      result.current.setPassword("wrong");
    });
    await act(async () => {
      await result.current.submit();
    });

    expect(mocks.track).toHaveBeenCalledWith("LoginFailed", {
      errorCode: "AUTHENTICATION_FAILED",
    });
    expect(result.current.appError?.code).toBe(ErrorCode.INVALID_CREDENTIALS);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("keeps state isolated between form instances", async () => {
    const onSuccessA = vi.fn();
    const onSuccessB = vi.fn();
    const { result: a } = renderHook(() => useLoginForm({ onSuccess: onSuccessA }));
    const { result: b } = renderHook(() => useLoginForm({ onSuccess: onSuccessB }));

    await act(async () => {
      a.current.setUsername(uid());
      b.current.setUsername(uid());
    });

    expect(a.current.username).not.toBe(b.current.username);
  });
});

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLoginForm } from "@/checkpoint/components/auth/login/useLoginForm";
import { AppError, ErrorCode } from "@/checkpoint/errors/app-error";

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  requestGuestMagicLink: vi.fn(),
  getCurrentUser: vi.fn(),
  setCurrentUser: vi.fn(),
  track: vi.fn(),
  fieldError: vi.fn(() => undefined),
  mutationError: vi.fn((error: unknown) => error as AppError),
}));

vi.mock("@/checkpoint/lib/auth/AuthManager", () => ({
  AuthManager: {
    login: mocks.login,
    requestGuestMagicLink: mocks.requestGuestMagicLink,
  },
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

  it("defaults the guest tab to phone", async () => {
    const { result } = renderHook(() => useLoginForm({ onSuccess: vi.fn() }));

    expect(result.current.guestTab).toBe("tel");
    expect(result.current.guestCallingCode).toBe("+49");
  });

  it.each([
    [" Guest@Example.COM ", "guest@example.com", undefined, undefined],
    ["151 23456789", "+4915123456789", "Max", "Mustermann"],
  ])("normalizes and requests a guest link for %s", async (input, expected, first, last) => {
    mocks.requestGuestMagicLink.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useLoginForm({ onSuccess: vi.fn() }));

    await act(async () => {
      if (expected.startsWith("+")) {
        result.current.setGuestTab("tel");
        result.current.setGuestPhoneNumber(input);
      } else {
        result.current.setGuestTab("email");
        result.current.setGuestEmail(input);
      }
      if (first) {
        result.current.setGuestFirstName(first);
        result.current.setGuestLastName(last ?? "");
      }
    });
    await act(async () => {
      await result.current.submitGuest();
    });

    expect(mocks.requestGuestMagicLink).toHaveBeenCalledWith(expected, first, last);
    expect(result.current.guestSent).toBe(true);
    expect(result.current.guestNetworkError).toBe(false);
  });

  it("requires both names before requesting a link for a phone identifier", async () => {
    const { result } = renderHook(() => useLoginForm({ onSuccess: vi.fn() }));

    await act(async () => {
      result.current.setGuestTab("tel");
      result.current.setGuestPhoneNumber("151 23456789");
      result.current.setGuestFirstName("Max");
      await result.current.submitGuest();
    });
    await act(async () => {
      await result.current.submitGuest();
    });

    expect(mocks.requestGuestMagicLink).not.toHaveBeenCalled();
    expect(result.current.guestNameRequired).toBe(true);
    expect(result.current.guestSent).toBe(false);
  });

  it("does not send an invalid guest email", async () => {
    const { result } = renderHook(() => useLoginForm({ onSuccess: vi.fn() }));

    await act(async () => {
      result.current.setGuestTab("email");
      result.current.setGuestEmail("not an email");
      await result.current.submitGuest();
    });

    expect(mocks.requestGuestMagicLink).not.toHaveBeenCalled();
    expect(result.current.guestInvalid).toBe(true);
  });

  it("does not send an invalid guest phone number", async () => {
    const { result } = renderHook(() => useLoginForm({ onSuccess: vi.fn() }));

    await act(async () => {
      result.current.setGuestTab("tel");
      result.current.setGuestPhoneNumber("abc");
      result.current.setGuestFirstName("Max");
      result.current.setGuestLastName("Mustermann");
      await result.current.submitGuest();
    });

    expect(mocks.requestGuestMagicLink).not.toHaveBeenCalled();
    expect(result.current.guestInvalid).toBe(true);
  });

  it("strips non-digit characters from the guest phone number", async () => {
    const { result } = renderHook(() => useLoginForm({ onSuccess: vi.fn() }));

    await act(async () => {
      result.current.setGuestTab("tel");
      result.current.setGuestPhoneNumber("+49 151-234 (56789)!");
      result.current.setGuestFirstName("Max");
      result.current.setGuestLastName("Mustermann");
    });

    expect(result.current.guestPhoneNumber).toBe("4915123456789");
  });

  it("shows only the technical retry state when transport fails", async () => {
    mocks.requestGuestMagicLink.mockRejectedValueOnce(new Error("network unavailable"));
    const { result } = renderHook(() => useLoginForm({ onSuccess: vi.fn() }));

    await act(async () => {
      result.current.setGuestTab("email");
      result.current.setGuestEmail("guest@example.com");
    });
    await act(async () => {
      await result.current.submitGuest();
    });

    expect(result.current.guestSent).toBe(false);
    expect(result.current.guestNetworkError).toBe(true);
  });
});

import { act, renderHook } from "@testing-library/react";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import { AppError, ErrorCode } from "@/checkpoint/errors/app-error";
import { ErrorContext, type ErrorContextValue } from "@/checkpoint/providers/ErrorProvider";
import { useFieldError } from "./useFieldError";
import { useMutationError } from "./useMutationError";

describe("error hooks", () => {
  it("resolves field errors from codes", () => {
    const error = new AppError({
      code: ErrorCode.USER_EMAIL_ALREADY_EXISTS,
      message: "Any message",
    });
    const { result } = renderHook(() => useFieldError(error, "email"));
    expect(result.current).toBe("This email is already registered");
  });

  it("reports mutation failures with operation metadata", () => {
    const report = vi.fn((error: unknown) => error as AppError);
    const value: ErrorContextValue = { lastError: null, report, clear: vi.fn() };
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
    );
    const { result } = renderHook(() => useMutationError({ operationName: "CreateInvitation" }), {
      wrapper,
    });
    const error = new AppError({ code: ErrorCode.INVITATION_ALREADY_EXISTS, message: "Exists" });

    act(() => void result.current(error));
    expect(report).toHaveBeenCalledWith(error, { operationName: "CreateInvitation" });
  });
});

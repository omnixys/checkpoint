import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { describe, expect, it } from "vitest";
import { AppError, ErrorCode, normalizeAppError } from "./app-error";
import { AppErrorMapper } from "./app-error-mapper";

describe("AppError normalization", () => {
  it("maps GraphQL extensions without comparing messages", () => {
    const error = new CombinedGraphQLErrors({
      data: null,
      errors: [
        {
          message: "Any localized message",
          extensions: {
            code: "USER_EMAIL_ALREADY_EXISTS",
            requestId: "request-1",
            correlationId: "correlation-1",
            traceId: "trace-1",
            timestamp: "2026-01-01T00:00:00.000Z",
            details: { field: "email" },
          },
        },
      ],
    });

    const normalized = normalizeAppError(error, {
      operationName: "Register",
      route: "/register",
      userId: "user-1",
    });

    expect(normalized.code).toBe(ErrorCode.USER_EMAIL_ALREADY_EXISTS);
    expect(normalized.requestId).toBe("request-1");
    expect(normalized.correlationId).toBe("correlation-1");
    expect(normalized.traceId).toBe("trace-1");
    expect(normalized.toLogContext()).toMatchObject({
      route: "/register",
      operationName: "Register",
      userId: "user-1",
    });
  });

  it("fails closed for an unknown backend code", () => {
    const error = new CombinedGraphQLErrors({
      errors: [{ message: "database details", extensions: { code: "NEW_UNKNOWN_CODE" } }],
    });
    const normalized = normalizeAppError(error);
    expect(normalized.code).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
    expect(normalized.message).toBe("An unexpected error occurred");
    expect(normalized.rawCode).toBe("NEW_UNKNOWN_CODE");
  });
});

describe("AppErrorMapper", () => {
  it("maps duplicate users to an email field error", () => {
    const error = new AppError({
      code: ErrorCode.USER_ALREADY_EXISTS,
      message: "Localized backend text",
    });
    expect(AppErrorMapper.fieldError(error, "email")).toBe("This email is already registered");
  });

  it("limits global mapping to platform-wide actions", () => {
    const invalidCredentials = new AppError({
      code: ErrorCode.INVALID_CREDENTIALS,
      message: "Invalid credentials",
    });
    const forbidden = new AppError({ code: ErrorCode.FORBIDDEN, message: "Forbidden" });

    expect(AppErrorMapper.mapGlobal(invalidCredentials)).toEqual([]);
    expect(AppErrorMapper.mapGlobal(forbidden)).toMatchObject([
      { type: "redirect", to: "/error/forbidden" },
    ]);
  });
});

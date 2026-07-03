import {
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
  ServerError,
  ServerParseError,
} from "@apollo/client/errors";
import { ErrorCode, isErrorCode } from "@omnixys/contracts/errors";

export interface AppErrorContext {
  readonly operationName?: string | undefined;
  readonly route?: string | undefined;
  readonly userId?: string | undefined;
}

export interface AppErrorInit extends AppErrorContext {
  readonly code: ErrorCode;
  readonly message: string;
  readonly status?: number | "UNKNOWN" | undefined;
  readonly requestId?: string | undefined;
  readonly correlationId?: string | undefined;
  readonly traceId?: string | undefined;
  readonly timestamp?: string | undefined;
  readonly details?: Readonly<Record<string, unknown>> | undefined;
  readonly cause?: unknown;
  readonly rawCode?: string | undefined;
}

export interface GraphQLErrorExtensions {
  readonly code?: unknown;
  readonly requestId?: unknown;
  readonly correlationId?: unknown;
  readonly traceId?: unknown;
  readonly timestamp?: unknown;
  readonly details?: unknown;
  readonly metadata?: unknown;
  readonly status?: unknown;
  readonly originalError?: {
    readonly statusCode?: unknown;
  };
}

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number | "UNKNOWN";
  readonly requestId: string | undefined;
  readonly correlationId: string | undefined;
  readonly traceId: string | undefined;
  readonly timestamp: string;
  readonly details: Readonly<Record<string, unknown>>;
  readonly operationName: string | undefined;
  readonly route: string | undefined;
  readonly userId: string | undefined;
  readonly rawCode: string | undefined;

  constructor(init: AppErrorInit);
  /** @deprecated Prefer the object-based constructor with a canonical `ErrorCode`. */
  constructor(message: string, status: number | "UNKNOWN", code?: string);
  constructor(
    initOrMessage: AppErrorInit | string,
    legacyStatus: number | "UNKNOWN" = "UNKNOWN",
    legacyCode?: string,
  ) {
    const init: AppErrorInit =
      typeof initOrMessage === "string"
        ? {
            code: canonicalCode(legacyCode),
            message: initOrMessage,
            status: legacyStatus,
            ...(legacyCode && !isErrorCode(legacyCode) ? { rawCode: legacyCode } : {}),
          }
        : initOrMessage;

    super(init.message, init.cause === undefined ? undefined : { cause: init.cause });
    this.name = AppError.name;
    this.code = init.code;
    this.status = init.status ?? statusForCode(init.code);
    this.requestId = init.requestId;
    this.correlationId = init.correlationId;
    this.traceId = init.traceId;
    this.timestamp = validTimestamp(init.timestamp) ?? new Date().toISOString();
    this.details = Object.freeze({ ...(init.details ?? {}) });
    this.operationName = init.operationName;
    this.route = init.route;
    this.userId = init.userId;
    this.rawCode = init.rawCode;
  }

  toLogContext(): Readonly<Record<string, unknown>> {
    return {
      code: this.code,
      requestId: this.requestId,
      correlationId: this.correlationId,
      traceId: this.traceId,
      timestamp: this.timestamp,
      route: this.route,
      operationName: this.operationName,
      userId: this.userId,
      status: this.status,
      details: this.details,
      rawCode: this.rawCode,
    };
  }
}

export function normalizeAppError(error: unknown, context: AppErrorContext = {}): AppError {
  if (error instanceof AppError) {
    if (!context.operationName && !context.route && !context.userId) {
      return error;
    }
    return new AppError({
      code: error.code,
      message: error.message,
      status: error.status,
      requestId: error.requestId,
      correlationId: error.correlationId,
      traceId: error.traceId,
      timestamp: error.timestamp,
      details: error.details,
      cause: error.cause,
      rawCode: error.rawCode,
      operationName: context.operationName ?? error.operationName,
      route: context.route ?? error.route,
      userId: context.userId ?? error.userId,
    });
  }

  if (CombinedGraphQLErrors.is(error)) {
    const graphQlError = selectGraphQlError(error.errors);
    const extensions = (graphQlError?.extensions ?? {}) as GraphQLErrorExtensions;
    const rawCode = stringOf(extensions.code);
    const code = canonicalCode(rawCode);
    return new AppError({
      code,
      message:
        code === ErrorCode.INTERNAL_SERVER_ERROR
          ? "An unexpected error occurred"
          : (graphQlError?.message ?? "Request failed"),
      status: normalizeStatus(extensions.status ?? extensions.originalError?.statusCode),
      requestId: stringOf(extensions.requestId),
      correlationId: stringOf(extensions.correlationId),
      traceId: stringOf(extensions.traceId),
      timestamp: validTimestamp(extensions.timestamp),
      details: recordOf(extensions.metadata) ?? recordOf(extensions.details) ?? {},
      cause: error,
      ...(rawCode && !isErrorCode(rawCode) ? { rawCode } : {}),
      ...context,
    });
  }

  return new AppError({
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    message: "An unexpected error occurred",
    cause: error,
    ...context,
  });
}

export function normalizeApolloError(error: unknown, context: AppErrorContext = {}): AppError {
  if (error instanceof AppError || CombinedGraphQLErrors.is(error)) {
    return normalizeAppError(error, context);
  }

  if (ServerError.is(error)) {
    return new AppError({
      code: codeForStatus(error.statusCode),
      message: messageForStatus(error.statusCode),
      status: error.statusCode,
      cause: error,
      ...context,
    });
  }

  if (
    CombinedProtocolErrors.is(error) ||
    ServerParseError.is(error) ||
    error instanceof TypeError
  ) {
    return new AppError({
      code: ErrorCode.NETWORK_ERROR,
      message: "The server could not be reached",
      cause: error,
      ...context,
    });
  }

  return new AppError({
    code: ErrorCode.NETWORK_ERROR,
    message: "The request could not be completed",
    cause: error,
    ...context,
  });
}

function selectGraphQlError(
  errors: CombinedGraphQLErrors["errors"],
): CombinedGraphQLErrors["errors"][number] | undefined {
  return (
    errors.find((candidate) =>
      isErrorCode((candidate.extensions as GraphQLErrorExtensions | undefined)?.code),
    ) ?? errors[0]
  );
}

function canonicalCode(value: unknown): ErrorCode {
  return isErrorCode(value) ? value : ErrorCode.INTERNAL_SERVER_ERROR;
}

function codeForStatus(status: number): ErrorCode {
  if (status === 401) {
    return ErrorCode.UNAUTHORIZED;
  }
  if (status === 403) {
    return ErrorCode.FORBIDDEN;
  }
  if (status === 429) {
    return ErrorCode.RATE_LIMIT_EXCEEDED;
  }
  if (status >= 500) {
    return ErrorCode.SERVICE_UNAVAILABLE;
  }
  return ErrorCode.NETWORK_ERROR;
}

function messageForStatus(status: number): string {
  if (status === 401) {
    return "Authentication is required";
  }
  if (status === 403) {
    return "Access is not authorized";
  }
  if (status === 429) {
    return "Too many requests";
  }
  if (status >= 500) {
    return "The service is temporarily unavailable";
  }
  return "The request could not be completed";
}

function statusForCode(code: ErrorCode): number | "UNKNOWN" {
  if (
    code === ErrorCode.UNAUTHORIZED ||
    code === ErrorCode.REFRESH_TOKEN_EXPIRED ||
    code === ErrorCode.SESSION_EXPIRED
  ) {
    return 401;
  }
  if (code === ErrorCode.FORBIDDEN || code === ErrorCode.UNAUTHORIZED_TENANT) {
    return 403;
  }
  if (code === ErrorCode.RATE_LIMIT_EXCEEDED) {
    return 429;
  }
  if (code === ErrorCode.SERVICE_UNAVAILABLE) {
    return 503;
  }
  return "UNKNOWN";
}

function normalizeStatus(value: unknown): number | "UNKNOWN" {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return "UNKNOWN";
}

function stringOf(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function validTimestamp(value: unknown): string | undefined {
  return typeof value === "string" && !Number.isNaN(Date.parse(value)) ? value : undefined;
}

function recordOf(value: unknown): Readonly<Record<string, unknown>> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Readonly<Record<string, unknown>>)
    : undefined;
}

export { ErrorCode };

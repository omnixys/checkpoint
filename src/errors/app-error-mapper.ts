import { ErrorCode } from "@omnixys/contracts/errors";
import type { AppError } from "./app-error";
import type { UiAction } from "./ui-action";

const GLOBAL_CODES = new Set<ErrorCode>([
  ErrorCode.UNAUTHORIZED,
  ErrorCode.REFRESH_TOKEN_EXPIRED,
  ErrorCode.SESSION_EXPIRED,
  ErrorCode.FORBIDDEN,
  ErrorCode.UNAUTHORIZED_TENANT,
  ErrorCode.RATE_LIMIT_EXCEEDED,
  ErrorCode.SERVICE_UNAVAILABLE,
  ErrorCode.NETWORK_ERROR,
]);

export class AppErrorMapper {
  static map(error: AppError): readonly UiAction[] {
    const action = (value: ActionWithoutCode): UiAction =>
      ({
        ...value,
        code: error.code,
      }) as UiAction;

    switch (error.code) {
      case ErrorCode.USER_ALREADY_EXISTS:
      case ErrorCode.USER_EMAIL_ALREADY_EXISTS:
        return [
          action({
            type: "fieldError",
            field: "email",
            message: "This email is already registered",
          }),
        ];
      case ErrorCode.USERNAME_ALREADY_EXISTS:
        return [
          action({
            type: "fieldError",
            field: "username",
            message: "This username is already registered",
          }),
        ];
      case ErrorCode.VALIDATION_ERROR:
      case ErrorCode.AUTHENTICATION_INPUT_INVALID:
      case ErrorCode.EVENT_INVALID_INPUT:
      case ErrorCode.INVITATION_INVALID_INPUT:
      case ErrorCode.NOTIFICATION_INPUT_INVALID: {
        const field = typeof error.details.field === "string" ? error.details.field : undefined;
        return field
          ? [action({ type: "fieldError", field, message: error.message })]
          : [action({ type: "toast", severity: "warning", message: error.message })];
      }
      case ErrorCode.INVALID_CREDENTIALS:
        return [action({ type: "toast", severity: "error", message: "Invalid credentials" })];
      case ErrorCode.UNAUTHORIZED:
      case ErrorCode.REFRESH_TOKEN_EXPIRED:
      case ErrorCode.SESSION_EXPIRED:
        return [
          action({
            type: "dialog",
            dialog: "sessionExpired",
            message: "Your session has expired. Please sign in again.",
            redirectTo: "/login",
          }),
        ];
      case ErrorCode.FORBIDDEN:
      case ErrorCode.UNAUTHORIZED_TENANT:
        return [
          action({ type: "redirect", to: "/error/forbidden", message: "Access is not authorized" }),
        ];
      case ErrorCode.RATE_LIMIT_EXCEEDED:
        return [
          action({
            type: "banner",
            severity: "warning",
            message: "Too many requests. Please wait before trying again.",
          }),
        ];
      case ErrorCode.SERVICE_UNAVAILABLE:
        return [
          action({
            type: "redirect",
            to: "/error/maintenance",
            message: "The service is temporarily unavailable",
          }),
        ];
      case ErrorCode.NETWORK_ERROR:
        return [
          action({
            type: "retry",
            mode: "offline",
            message: "The server could not be reached",
          }),
        ];
      case ErrorCode.KAFKA_UNAVAILABLE:
      case ErrorCode.CACHE_UNAVAILABLE:
      case ErrorCode.MINIO_UNAVAILABLE:
      case ErrorCode.IDENTITY_PROVIDER_UNAVAILABLE:
      case ErrorCode.NOTIFICATION_CHANNEL_UNAVAILABLE:
        return [
          action({
            type: "retry",
            mode: "service",
            message: "A required service is temporarily unavailable",
          }),
        ];
      case ErrorCode.SEAT_OCCUPIED:
      case ErrorCode.SEAT_ALREADY_RESERVED:
        return [
          action({
            type: "toast",
            severity: "warning",
            message: "This seat is no longer available",
          }),
          action({ type: "retry", mode: "service", message: "Reload the seat map and try again" }),
        ];
      case ErrorCode.TICKET_REVOKED:
      case ErrorCode.TICKET_ALREADY_REDEEMED:
      case ErrorCode.TICKET_ALREADY_SCANNED:
        return [action({ type: "dialog", dialog: "error", message: error.message })];
      case ErrorCode.INTERNAL_SERVER_ERROR:
        return [
          action({ type: "toast", severity: "error", message: "An unexpected error occurred" }),
        ];
      default:
        return [action({ type: "toast", severity: "error", message: error.message })];
    }
  }

  static mapGlobal(error: AppError): readonly UiAction[] {
    return GLOBAL_CODES.has(error.code) ? AppErrorMapper.map(error) : [];
  }

  static fieldError(error: AppError, field: string): string | undefined {
    return AppErrorMapper.map(error).find(
      (action): action is Extract<UiAction, { type: "fieldError" }> =>
        action.type === "fieldError" && action.field === field,
    )?.message;
  }
}

type ActionWithoutCode = UiAction extends infer T
  ? T extends UiAction
    ? Omit<T, "code">
    : never
  : never;

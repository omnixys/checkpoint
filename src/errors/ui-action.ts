import type { ErrorCode } from "@omnixys/contracts-ts/errors";

interface UiActionBase {
  readonly code: ErrorCode;
  readonly message: string;
}

export type UiAction =
  | (UiActionBase & {
      readonly type: "fieldError";
      readonly field: string;
    })
  | (UiActionBase & {
      readonly type: "toast";
      readonly severity: "error" | "warning" | "info" | "success";
    })
  | (UiActionBase & {
      readonly type: "dialog";
      readonly dialog: "sessionExpired" | "error";
      readonly redirectTo?: string;
    })
  | (UiActionBase & {
      readonly type: "banner";
      readonly severity: "error" | "warning" | "info";
    })
  | (UiActionBase & {
      readonly type: "redirect";
      readonly to: string;
    })
  | (UiActionBase & {
      readonly type: "retry";
      readonly mode: "offline" | "service";
    })
  | (UiActionBase & {
      readonly type: "silent";
    });

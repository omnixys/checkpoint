import {
  type AppError,
  type AppErrorContext,
  normalizeApolloError,
  normalizeAppError,
} from "./app-error";
import { AppErrorMapper } from "./app-error-mapper";
import type { UiAction } from "./ui-action";

export interface ErrorNotification {
  readonly error: AppError;
  readonly actions: readonly UiAction[];
}

export interface CaptureErrorOptions extends AppErrorContext {
  readonly source?: "apollo" | "application";
  readonly scope?: "global" | "all";
}

export type ErrorNotificationListener = (notification: ErrorNotification) => void;

export class NotificationService {
  private readonly listeners = new Set<ErrorNotificationListener>();
  private readonly pending: ErrorNotification[] = [];
  private readonly recent = new Map<string, number>();

  capture(error: unknown, options: CaptureErrorOptions = {}): AppError {
    const context: AppErrorContext = {
      ...(options.operationName ? { operationName: options.operationName } : {}),
      ...(options.route ? { route: options.route } : {}),
      ...(options.userId ? { userId: options.userId } : {}),
    };
    const appError =
      options.source === "apollo"
        ? normalizeApolloError(error, context)
        : normalizeAppError(error, context);
    const actions =
      options.scope === "global"
        ? AppErrorMapper.mapGlobal(appError)
        : AppErrorMapper.map(appError);
    if (actions.length > 0) this.publish({ error: appError, actions });
    return appError;
  }

  subscribe(listener: ErrorNotificationListener): () => void {
    this.listeners.add(listener);
    if (this.listeners.size === 1 && this.pending.length > 0) {
      for (const notification of this.pending.splice(0)) listener(notification);
    }
    return () => this.listeners.delete(listener);
  }

  clear(): void {
    this.pending.length = 0;
    this.recent.clear();
  }

  private publish(notification: ErrorNotification): void {
    const now = Date.now();
    const fingerprint = [
      notification.error.code,
      notification.error.requestId,
      notification.error.operationName,
      notification.actions.map((action) => action.type).join(","),
    ].join(":");
    const lastSeen = this.recent.get(fingerprint);
    if (lastSeen !== undefined && now - lastSeen < 2000) return;
    this.recent.set(fingerprint, now);

    if (this.listeners.size === 0) {
      this.pending.push(notification);
      if (this.pending.length > 20) this.pending.shift();
      return;
    }

    for (const listener of this.listeners) listener(notification);
  }
}

export const notificationService = new NotificationService();

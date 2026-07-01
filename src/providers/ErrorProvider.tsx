"use client";

import type React from "react";
import { createContext, useCallback, useMemo, useState } from "react";
import {
  type AppError,
  type AppErrorContext,
  normalizeAppError,
} from "@/checkpoint/errors/app-error";
import { notificationService } from "@/checkpoint/errors/notification.service";
import { NotificationProvider } from "@/checkpoint/providers/NotificationProvider";

export interface ReportErrorOptions extends AppErrorContext {
  readonly notify?: boolean;
}

export interface ErrorContextValue {
  readonly lastError: AppError | null;
  readonly report: (error: unknown, options?: ReportErrorOptions) => AppError;
  readonly clear: () => void;
}

export const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

export function ErrorProvider({ children }: { readonly children: React.ReactNode }) {
  const [lastError, setLastError] = useState<AppError | null>(null);

  const report = useCallback((error: unknown, options: ReportErrorOptions = {}) => {
    const appError =
      options.notify === false
        ? normalizeAppError(error, options)
        : notificationService.capture(error, { ...options, scope: "all" });
    setLastError(appError);
    return appError;
  }, []);

  const clear = useCallback(() => setLastError(null), []);
  const value = useMemo(() => ({ lastError, report, clear }), [clear, lastError, report]);

  return (
    <ErrorContext.Provider value={value}>
      <NotificationProvider onError={setLastError}>{children}</NotificationProvider>
    </ErrorContext.Provider>
  );
}

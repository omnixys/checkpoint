"use client";

import { useEffect, useMemo } from "react";
import {
  type AppError,
  type AppErrorContext,
  normalizeAppError,
} from "@/checkpoint/errors/app-error";
import { useAppError } from "./useAppError";

export function useQueryError(
  error: unknown | null | undefined,
  context: AppErrorContext = {},
): AppError | undefined {
  const { report } = useAppError();
  const { operationName, route, userId } = context;
  const appError = useMemo(
    () =>
      error
        ? normalizeAppError(error, {
            ...(operationName ? { operationName } : {}),
            ...(route ? { route } : {}),
            ...(userId ? { userId } : {}),
          })
        : undefined,
    [error, operationName, route, userId],
  );

  useEffect(() => {
    if (appError) report(appError);
  }, [appError, report]);

  return appError;
}

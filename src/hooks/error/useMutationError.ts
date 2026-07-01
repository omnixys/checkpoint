"use client";

import { useCallback } from "react";
import type { AppErrorContext } from "@/checkpoint/errors/app-error";
import { useAppError } from "./useAppError";

export function useMutationError(defaultContext: AppErrorContext = {}) {
  const { report } = useAppError();
  const { operationName, route, userId } = defaultContext;
  return useCallback(
    (error: unknown, context: AppErrorContext = {}) =>
      report(error, {
        ...(operationName ? { operationName } : {}),
        ...(route ? { route } : {}),
        ...(userId ? { userId } : {}),
        ...context,
      }),
    [operationName, report, route, userId],
  );
}

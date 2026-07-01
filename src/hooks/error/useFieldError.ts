"use client";

import { useMemo } from "react";
import { type AppError, normalizeAppError } from "@/checkpoint/errors/app-error";
import { AppErrorMapper } from "@/checkpoint/errors/app-error-mapper";

export function useFieldError(error: AppError | unknown | null, field: string): string | undefined {
  return useMemo(() => {
    if (!error) return undefined;
    return AppErrorMapper.fieldError(normalizeAppError(error), field);
  }, [error, field]);
}

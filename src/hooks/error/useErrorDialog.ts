"use client";

import { useMemo } from "react";
import { AppErrorMapper } from "@/checkpoint/errors/app-error-mapper";
import type { UiAction } from "@/checkpoint/errors/ui-action";
import { useAppError } from "./useAppError";

export function useErrorDialog(): {
  readonly open: boolean;
  readonly action: Extract<UiAction, { type: "dialog" }> | undefined;
  readonly close: () => void;
} {
  const { lastError, clear } = useAppError();
  const action = useMemo(
    () =>
      lastError
        ? AppErrorMapper.map(lastError).find(
            (candidate): candidate is Extract<UiAction, { type: "dialog" }> =>
              candidate.type === "dialog",
          )
        : undefined,
    [lastError],
  );
  return { open: action !== undefined, action, close: clear };
}

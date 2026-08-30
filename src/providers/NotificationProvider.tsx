"use client";

import { Alert, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { SnackbarProvider, useSnackbar } from "notistack";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import ErrorCodeDialog from "@/checkpoint/components/error/ErrorCodeDialog";
import OfflineComponent from "@/checkpoint/components/error/OfflineComponent";
import RetryComponent from "@/checkpoint/components/error/RetryComponent";
import SessionExpiredDialog from "@/checkpoint/components/error/SessionExpiredDialog";
import type { AppError } from "@/checkpoint/errors/app-error";
import {
  type ErrorNotification,
  notificationService,
} from "@/checkpoint/errors/notification.service";
import type { UiAction } from "@/checkpoint/errors/ui-action";
import { env } from "@/checkpoint/lib/env";

interface NotificationProviderProps {
  readonly children: React.ReactNode;
  readonly onError: (error: AppError) => void;
}

interface ActiveDialog {
  readonly error: AppError;
  readonly action: Extract<UiAction, { type: "dialog" }>;
}

interface ActiveRetry {
  readonly error: AppError;
  readonly action: Extract<UiAction, { type: "retry" }>;
}

export function NotificationProvider({ children, onError }: NotificationProviderProps) {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={5000} preventDuplicate={true}>
      <NotificationRuntime onError={onError}>{children}</NotificationRuntime>
    </SnackbarProvider>
  );
}

function NotificationRuntime({ children, onError }: NotificationProviderProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [dialog, setDialog] = useState<ActiveDialog | null>(null);
  const [retry, setRetry] = useState<ActiveRetry | null>(null);
  const [banner, setBanner] = useState<Extract<UiAction, { type: "banner" }> | null>(null);

  const handle = useCallback(
    ({ error, actions }: ErrorNotification) => {
      onError(error);
      for (const action of actions) {
        switch (action.type) {
          case "toast":
            enqueueSnackbar(action.message, { variant: action.severity });
            break;
          case "dialog":
            setDialog({ error, action });
            break;
          case "banner":
            setBanner(action);
            break;
          case "redirect": {
            const destination = appPath(action.to);
            if (typeof window === "undefined" || window.location.pathname !== destination) {
              router.replace(destination);
            }
            break;
          }
          case "retry":
            setRetry({ error, action });
            break;
          case "fieldError":
          case "silent":
            break;
        }
      }
    },
    [enqueueSnackbar, onError, router],
  );

  useEffect(() => notificationService.subscribe(handle), [handle]);

  const closeDialog = () => setDialog(null);
  const continueToLogin = () => {
    const destination = appPath(dialog?.action.redirectTo ?? "/login");
    setDialog(null);
    router.replace(destination);
  };
  const reload = () => window.location.reload();

  return (
    <>
      {children}
      {banner && (
        <Box sx={{ position: "fixed", top: 12, left: 12, right: 12, zIndex: 1500 }}>
          <Alert severity={banner.severity} onClose={() => setBanner(null)}>
            {banner.message}
          </Alert>
        </Box>
      )}
      <SessionExpiredDialog
        open={dialog?.action.dialog === "sessionExpired"}
        error={dialog?.error ?? null}
        onContinue={continueToLogin}
      />
      {dialog?.action.dialog === "error" && (
        <ErrorCodeDialog open={true} error={dialog.error} onClose={closeDialog} />
      )}
      {retry?.action.mode === "offline" && (
        <OfflineComponent
          open={true}
          requestId={retry.error.requestId}
          onRetry={reload}
          onDismiss={() => setRetry(null)}
        />
      )}
      {retry?.action.mode === "service" && (
        <RetryComponent
          open={true}
          title="Temporarily unavailable"
          message={retry.action.message}
          requestId={retry.error.requestId}
          onRetry={reload}
          onDismiss={() => setRetry(null)}
        />
      )}
    </>
  );
}

function appPath(path: string): string {
  const base = env.CHECKPOINT_BASE_PATH.endsWith("/")
    ? env.CHECKPOINT_BASE_PATH.slice(0, -1)
    : env.CHECKPOINT_BASE_PATH;
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}` || "/";
}

"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import RetryComponent from "@/checkpoint/components/error/RetryComponent";
import { notificationService } from "@/checkpoint/errors/notification.service";

export default function ApplicationError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
    notificationService.capture(error, {
      scope: "all",
      ...(typeof window === "undefined" ? {} : { route: window.location.pathname }),
    });
  }, [error]);

  return (
    <RetryComponent
      open={true}
      title="Something went wrong"
      message="The page could not be loaded. Try again."
      onRetry={reset}
    />
  );
}

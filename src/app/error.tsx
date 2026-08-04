"use client";

import { useTelemetry } from "@omnixys/observability-ts/react";
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
  const telemetry = useTelemetry();

  useEffect(() => {
    telemetry.recordException(error, {
      route: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
    notificationService.capture(error, {
      scope: "all",
      ...(typeof window === "undefined" ? {} : { route: window.location.pathname }),
    });
  }, [error, telemetry]);

  return (
    <RetryComponent
      open={true}
      title="Something went wrong"
      message="The page could not be loaded. Try again."
      onRetry={reset}
    />
  );
}

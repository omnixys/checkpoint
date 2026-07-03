"use client";

import * as Sentry from "@sentry/nextjs";
import React from "react";
import { notificationService } from "@/checkpoint/errors/notification.service";
import { getLogger } from "@/checkpoint/utils/logger";
import RetryComponent from "./RetryComponent";

interface ErrorBoundaryProps {
  readonly children: React.ReactNode;
}

interface ErrorBoundaryState {
  readonly error: Error | null;
}

const logger = getLogger("ErrorBoundary");

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo): void {
    Sentry.captureException(error);
    const appError = notificationService.capture(error, {
      scope: "all",
      ...(typeof window === "undefined" ? {} : { route: window.location.pathname }),
    });
    logger.error("React render failed", {
      ...appError.toLogContext(),
      componentStack: info.componentStack,
    });
  }

  private readonly reset = () => this.setState({ error: null });

  override render(): React.ReactNode {
    if (!this.state.error) {
      return this.props.children;
    }
    return (
      <RetryComponent
        open={true}
        title="Something went wrong"
        message="The page could not be rendered. Try again."
        onRetry={this.reset}
      />
    );
  }
}

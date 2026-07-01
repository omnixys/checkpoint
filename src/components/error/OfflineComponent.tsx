"use client";

import RetryComponent from "./RetryComponent";

interface OfflineComponentProps {
  readonly open: boolean;
  readonly requestId?: string | undefined;
  readonly onRetry: () => void;
  readonly onDismiss?: (() => void) | undefined;
}

export default function OfflineComponent(props: OfflineComponentProps) {
  return (
    <RetryComponent
      {...props}
      title="You appear to be offline"
      message="Check your connection and try again."
    />
  );
}

"use client";

import { useRouter } from "next/navigation";
import RetryComponent from "@/checkpoint/components/error/RetryComponent";
import { env } from "@/checkpoint/lib/env";

export default function MaintenancePage() {
  const router = useRouter();
  return (
    <RetryComponent
      open={true}
      title="Scheduled maintenance"
      message="The service is temporarily unavailable. Please try again shortly."
      onRetry={() => window.location.reload()}
      onDismiss={() => router.replace(env.CHECKPOINT_BASE_PATH)}
    />
  );
}

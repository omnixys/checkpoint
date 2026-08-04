import { env } from "@/checkpoint/config/env.server";

/**
 * Next.js instrumentation hook.
 *
 * Replaces the former @sentry/nextjs instrumentation with
 * @omnixys/observability-ts server-side setup.
 *
 * In the current phase, server-side OTel initialization is deferred.
 * The Gateway handles OTLP ingestion; the Next.js server buffers traces
 * via the auto-instrumentations-node package when the `@omnixys/observability-ts`
 * server module is imported.
 */
export async function register() {
  if (env.NEXT_RUNTIME === "nodejs") {
    // Future: initialize server-side OTel SDK here
    // const { initServerTracing } = await import("@omnixys/observability-ts/server");
    // initServerTracing({ serviceName: "checkpoint-server", ... });
  }

  if (env.NEXT_RUNTIME === "edge") {
    // Edge runtime – no OTel SDK support yet
  }
}

/**
 * Placeholder for onRequestError.
 *
 * Previously re-exported from @sentry/nextjs. Now a noop – the
 * ObservabilityErrorBoundary + error.tsx pages capture errors client-side.
 */
export function onRequestError(error: Error, request: { path: string; method: string }): void {
  if (env.NODE_ENV === "development") {
    console.error("[observability] request error", request.path, error.message);
  }
}

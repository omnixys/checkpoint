/**
 * Client instrumentation for @omnixys/observability-ts.
 * Replaces the former @sentry/nextjs client init with OpenTelemetry browser tracing.
 *
 * initializeBrowserTracing is safe to call multiple times – subsequent calls
 * are no-ops when already initialized.
 */
import { initializeBrowserTracing } from "@omnixys/observability-ts/browser";

const sampleRate = (rate: string | undefined, fallback: number): number => {
  if (rate === undefined) return fallback;
  const parsed = Number(rate);
  return Number.isFinite(parsed) ? parsed : fallback;
};

initializeBrowserTracing({
  serviceName: process.env.NEXT_PUBLIC_OTEL_SERVICE_NAME ?? "checkpoint-web",
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  sampleRate: sampleRate(
    process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE,
    process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  ),
  otlpEndpoint: process.env.NEXT_PUBLIC_OTEL_ENDPOINT ?? "/otel/v1/traces",
  instrumentations: ["fetch", "xhr", "document-load"],
  enabled: process.env.NODE_ENV === "production",
});

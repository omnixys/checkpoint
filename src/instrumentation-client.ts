/**
 * Client instrumentation for @omnixys/observability-ts.
 * Replaces the former @sentry/nextjs client init with OpenTelemetry browser tracing.
 *
 * initializeBrowserTracing is safe to call multiple times – subsequent calls
 * are no-ops when already initialized.
 */
import { initializeBrowserTracing } from "@omnixys/observability-ts/browser";
import { env } from "@/checkpoint/lib/env";

initializeBrowserTracing({
  serviceName: env.OTEL_SERVICE_NAME,
  environment: env.NODE_ENV,
  sampleRate: env.OTEL_SAMPLE_RATE,
  otlpEndpoint: env.OTEL_ENDPOINT,
  instrumentations: ["fetch", "xhr", "document-load"],
  enabled: env.IS_PRODUCTION,
});

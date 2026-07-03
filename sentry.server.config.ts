import * as Sentry from "@sentry/nextjs";

const sampleRate = (rate: string | undefined, fallback: number): number => {
  if (rate === undefined) return fallback;
  const parsed = Number(rate);
  return Number.isFinite(parsed) ? parsed : fallback;
};

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  environment:
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,

  tracesSampleRate: sampleRate(
    process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE,
    process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  ),

  includeLocalVariables: true,
});

// Use metrics in both server and client code
Sentry.metrics.count('server_user_action', 1);
Sentry.metrics.distribution('server_api_response_time', 150);
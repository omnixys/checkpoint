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

    integrations: [
    // send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
  // Enable logs to be sent to Sentry
  enableLogs: true,
});

// Use metrics in both server and client code
Sentry.metrics.count('client_user_action', 1);
Sentry.metrics.distribution('client_api_response_time', 150);

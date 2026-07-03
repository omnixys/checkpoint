import * as Sentry from "@sentry/nextjs";

const sampleRate = (rate: string | undefined, fallback: number): number => {
  if (rate === undefined) return fallback;
  const parsed = Number(rate);
  return Number.isFinite(parsed) ? parsed : fallback;
};

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,

  tracesSampleRate: sampleRate(
    process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE,
    process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  ),

  replaysSessionSampleRate: sampleRate(
    process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE,
    process.env.NODE_ENV === "production" ? 0.05 : 0.1,
  ),

  replaysOnErrorSampleRate: sampleRate(
    process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE,
    1.0,
  ),

  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],

  beforeSend(event) {
    if (event.request?.headers) {
      delete event.request.headers.authorization;
      delete event.request.headers.Authorization;
      delete event.request.headers.cookie;
      delete event.request.headers.Cookie;
      delete event.request.headers["x-api-key"];
      delete event.request.headers["X-Api-Key"];
    }
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

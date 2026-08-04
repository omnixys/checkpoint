import {
  getEnv,
  toBasePath,
  toHttpUrl,
  toNodeEnv,
  toSampleRate,
  toUuidOrEmpty,
  toWsUrl,
} from "./env.shared";

const NODE_ENV = getEnv("NODE_ENV", process.env.NODE_ENV, {
  fallback: "development",
  transform: toNodeEnv,
});
const APP_URL = getEnv("NEXT_PUBLIC_APP_URL", process.env.NEXT_PUBLIC_APP_URL, {
  required: true,
  transform: toHttpUrl,
});

export const env = {
  NODE_ENV,
  IS_PRODUCTION: NODE_ENV === "production",
  BACKEND_SERVER_URL: getEnv(
    "NEXT_PUBLIC_BACKEND_SERVER_URL",
    process.env.NEXT_PUBLIC_BACKEND_SERVER_URL,
    { required: true, transform: toHttpUrl },
  ),
  BACKEND_WS_URL: getEnv("NEXT_PUBLIC_GRAPHQL_WS_URL", process.env.NEXT_PUBLIC_GRAPHQL_WS_URL, {
    required: true,
    transform: toWsUrl,
  }),
  CHECKPOINT_BASE_PATH: getEnv(
    "NEXT_PUBLIC_CHECKPOINT_BASE_PATH",
    process.env.NEXT_PUBLIC_CHECKPOINT_BASE_PATH,
    { fallback: "/", transform: toBasePath },
  ),
  EVENT_ID: getEnv("NEXT_PUBLIC_EVENT_ID", process.env.NEXT_PUBLIC_EVENT_ID, {
    fallback: "",
    transform: toUuidOrEmpty,
  }),
  APP_URL,
  BASE_URL: getEnv("NEXT_PUBLIC_BASE_URL", process.env.NEXT_PUBLIC_BASE_URL, {
    fallback: APP_URL,
  }),
  INVITATION_API: getEnv("NEXT_PUBLIC_INVITATION_API", process.env.NEXT_PUBLIC_INVITATION_API, {
    required: true,
    transform: toHttpUrl,
  }),
  EVENT_API: getEnv("NEXT_PUBLIC_EVENT_API", process.env.NEXT_PUBLIC_EVENT_API, {
    required: true,
    transform: toHttpUrl,
  }),
  NEXYS_HOME_URL: getEnv("NEXT_PUBLIC_NEXYS_HOME_URL", process.env.NEXT_PUBLIC_NEXYS_HOME_URL, {
    required: true,
    transform: toHttpUrl,
  }),
  OTEL_ENDPOINT: getEnv("NEXT_PUBLIC_OTEL_ENDPOINT", process.env.NEXT_PUBLIC_OTEL_ENDPOINT, {
    fallback: "/otel/v1/traces",
  }),
  OTEL_SERVICE_NAME: getEnv(
    "NEXT_PUBLIC_OTEL_SERVICE_NAME",
    process.env.NEXT_PUBLIC_OTEL_SERVICE_NAME,
    { fallback: "checkpoint-web" },
  ),
  OTEL_SAMPLE_RATE: getEnv(
    "NEXT_PUBLIC_OTEL_SAMPLE_RATE",
    process.env.NEXT_PUBLIC_OTEL_SAMPLE_RATE,
    { fallback: NODE_ENV === "production" ? "0.1" : "1", transform: toSampleRate },
  ),
} as const;

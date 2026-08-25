import "server-only";

import { env as publicEnv } from "./env";
import { getEnv, minLength, toHttpUrl } from "./env.shared";

export const env = {
  ...publicEnv,
  ANALYTICS_CONSENT_SECRET: getEnv(
    "ANALYTICS_CONSENT_SECRET",
    process.env.ANALYTICS_CONSENT_SECRET,
    { required: true, transform: minLength(2) },
  ),
  ANALYTICS_API_URL: getEnv("ANALYTICS_API_URL", process.env.ANALYTICS_API_URL, {
    required: true,
    transform: toHttpUrl,
  }),
  ANALYTICS_INTERNAL_TOKEN: getEnv(
    "ANALYTICS_INTERNAL_TOKEN",
    process.env.ANALYTICS_INTERNAL_TOKEN,
    { required: true, transform: minLength(2) },
  ),
  NEXT_RUNTIME: getEnv("NEXT_RUNTIME", process.env.NEXT_RUNTIME, { fallback: "nodejs" }),
} as const;

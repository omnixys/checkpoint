import "server-only";

import { env as publicEnv } from "./env";
import { getEnv, minLength } from "./env.shared";

export const env = {
  ...publicEnv,
  ANALYTICS_CONSENT_SECRET: getEnv(
    "ANALYTICS_CONSENT_SECRET",
    process.env.ANALYTICS_CONSENT_SECRET,
    { required: true, transform: minLength(2) },
  ),
  NEXT_RUNTIME: getEnv("NEXT_RUNTIME", process.env.NEXT_RUNTIME, { fallback: "nodejs" }),
} as const;

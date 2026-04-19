/**
 * Client-safe environment access.
 * Uses lazy getters to avoid stale values caused by build-time evaluation.
 */

import { get } from "http";

export const env = {
  get BACKEND_SERVER_URL(): string {
    return process.env.NEXT_PUBLIC_BACKEND_SERVER_URL!;
  },

  get BACKEND_WS_URL(): string {
    return process.env.NEXT_PUBLIC_BACKEND_WS_URL!;
  },

  get CHECKPOINT_BASE_PATH(): string {
    return process.env.NEXT_PUBLIC_CHECKPOINT_BASE_PATH!;
  },

  get NEXT_PUBLIC_EVENT_ID(): string {
    return process.env.NEXT_PUBLIC_EVENT_ID!;
  },

  get NEXT_PUBLIC_BASE_URL(): string {
    return process.env.NEXT_PUBLIC_BASE_URL!;
  },

  get NEXT_PUBLIC_UPLOAD_URI(): string {
    return process.env.NEXT_PUBLIC_UPLOAD_URI!;
  },

  get NEXT_PUBLIC_APP_URL(): string {
    return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  }

} as const;

/**
 * Debug output (runtime safe)
 */
if (process.env.NODE_ENV !== "production") {
  console.debug("================= ENV (LAZY) =================");
  console.debug({
    BACKEND_SERVER_URL: env.BACKEND_SERVER_URL,
    BACKEND_WS_URL: env.BACKEND_WS_URL,
    CHECKPOINT_BASE_PATH: env.CHECKPOINT_BASE_PATH,
    NEXT_PUBLIC_EVENT_ID: env.NEXT_PUBLIC_EVENT_ID,
    NEXT_PUBLIC_BASE_URL: env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_UPLOAD_URI: env.NEXT_PUBLIC_UPLOAD_URI,
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
  });
  console.debug("==============================================");
}

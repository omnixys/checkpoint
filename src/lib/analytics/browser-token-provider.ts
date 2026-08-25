import { getLogger } from "@/checkpoint/utils/logger";

const logger = getLogger("Analytics");

/**
 * Fetch a browser analytics token from the same-origin proxy.
 *
 * Telemetry must never break the application: any failure resolves with an
 * empty token, which makes the SDK skip the flush and retry queued events.
 */
export async function fetchAnalyticsToken(): Promise<string> {
  try {
    const response = await fetch("/api/analytics/token", {
      method: "POST",
      credentials: "same-origin",
    });
    if (!response.ok) {
      throw new Error(`Analytics token request failed with HTTP ${response.status}`);
    }
    const payload = (await response.json()) as { token?: unknown };
    if (typeof payload.token !== "string" || !payload.token) {
      throw new Error("Analytics token response did not contain a token");
    }
    return payload.token;
  } catch (error) {
    logger.warn("Analytics token unavailable; events stay queued", {
      message: error instanceof Error ? error.message : String(error),
    });
    return "";
  }
}

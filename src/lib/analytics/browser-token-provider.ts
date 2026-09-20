import { getLogger } from "@/checkpoint/utils/logger";

const logger = getLogger("Analytics");

/**
 * Token provider compatible with the @omnixys/analytics-sdk AnalyticsTokenProvider type.
 * Analytics must not surface token failures as application runtime errors.
 */
export async function fetchAnalyticsToken(_request?: { forceRefresh: boolean }): Promise<string> {
  try {
    const response = await fetch("/api/analytics/token", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ publicReference: publicReference() }),
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

function publicReference(): { type: "event"; id: string } | undefined {
  const location = globalThis.location;
  if (!location?.pathname.endsWith("/rsvp")) return undefined;

  const eventId = new URLSearchParams(location.search).get("eventId");
  return eventId ? { type: "event", id: eventId } : undefined;
}

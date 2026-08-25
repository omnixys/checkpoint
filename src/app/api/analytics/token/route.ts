import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/checkpoint/config/env.server";
import { OMNIXYS_TENANT_ID } from "@/checkpoint/lib/apollo/auth-context";

/**
 * Event names emitted by this application. The analytics service issues
 * browser tokens restricted to exactly this allowlist.
 */
const ANALYTICS_EVENT_NAMES = [
  "$pageview",
  "ConversationOpened",
  "InvitationOpened",
  "LoginFailed",
  "LoginStarted",
  "LoginSucceeded",
  "MessageSendFailed",
  "MessageSendStarted",
  "MessageSent",
  "QrScanStarted",
  "RsvpCompleted",
  "RsvpFailed",
  "RsvpStarted",
  "SeatChangeCompleted",
  "SeatChangeFailed",
  "SeatChangeStarted",
  "TicketDownloadFailed",
  "TicketDownloadStarted",
  "TicketDownloaded",
] as const;

/**
 * Same-origin proxy for the analytics browser token endpoint.
 *
 * The upstream endpoint is server-to-server only (guarded by an internal
 * gateway token), so the browser must never call it directly.
 */
export async function POST(): Promise<NextResponse> {
  if (!(await isSameOrigin())) {
    return NextResponse.json({ code: "INVALID_ORIGIN" }, { status: 403 });
  }

  try {
    const response = await fetch(`${env.ANALYTICS_API_URL}/v1/analytics/tokens`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-token": env.ANALYTICS_INTERNAL_TOKEN,
        "x-tenant-id": OMNIXYS_TENANT_ID,
      },
      body: JSON.stringify({
        application: "checkpoint",
        origin: await requestOrigin(),
        environment: env.IS_PRODUCTION ? "PRODUCTION" : "DEVELOPMENT",
        events: ANALYTICS_EVENT_NAMES,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ code: "ANALYTICS_UNAVAILABLE" }, { status: 502 });
    }

    const payload = (await response.json()) as { token?: unknown; expiresIn?: unknown };
    if (typeof payload.token !== "string" || !payload.token) {
      return NextResponse.json({ code: "ANALYTICS_UNAVAILABLE" }, { status: 502 });
    }

    return NextResponse.json(
      { token: payload.token, expiresIn: payload.expiresIn },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ code: "ANALYTICS_UNAVAILABLE" }, { status: 502 });
  }
}

async function isSameOrigin(): Promise<boolean> {
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ?? (env.IS_PRODUCTION ? "https" : "http");
  if (!origin || !host) return false;
  try {
    return new URL(origin).origin === `${protocol}://${host}`;
  } catch {
    return false;
  }
}

async function requestOrigin(): Promise<string> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ?? (env.IS_PRODUCTION ? "https" : "http");
  return `${protocol}://${host ?? "localhost"}`;
}

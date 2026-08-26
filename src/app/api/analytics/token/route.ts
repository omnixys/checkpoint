import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/checkpoint/config/env.server";

type PublicReference = { type: "event"; id: string } | { type: "invitation"; id: string };

/**
 * Same-origin proxy for the Gateway's analytics browser token endpoint.
 * The Gateway owns service-to-service authentication and tenant resolution.
 */
export async function POST(request?: Request): Promise<NextResponse> {
  if (!(await isSameOrigin())) {
    return NextResponse.json({ code: "INVALID_ORIGIN" }, { status: 403 });
  }

  try {
    const requestHeaders = await headers();
    const response = await fetch(`${env.ANALYTICS_URL}/v1/analytics/token`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: await requestOrigin(),
        ...forwardedHeader(requestHeaders, "authorization"),
        ...forwardedHeader(requestHeaders, "cookie"),
      },
      body: JSON.stringify(await requestBody(request)),
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

function forwardedHeader(requestHeaders: Awaited<ReturnType<typeof headers>>, name: string) {
  const value = requestHeaders.get(name);
  return value ? { [name]: value } : {};
}

async function requestBody(request?: Request): Promise<{ publicReference?: PublicReference }> {
  if (!request) return {};
  try {
    const body = (await request.json()) as { publicReference?: unknown };
    const reference = body.publicReference;
    if (isPublicReference(reference)) {
      return { publicReference: reference };
    }
  } catch {
    // A missing body is valid for authenticated requests.
  }
  return {};
}

function isPublicReference(value: unknown): value is PublicReference {
  if (!value || typeof value !== "object") return false;
  const reference = value as { type?: unknown; id?: unknown };
  return (
    (reference.type === "event" || reference.type === "invitation") &&
    typeof reference.id === "string"
  );
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

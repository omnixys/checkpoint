import { createHmac, timingSafeEqual } from "node:crypto";
import type { ConsentState } from "@omnixys/analytics-sdk/browser";

export const ANALYTICS_CONSENT_COOKIE = "omnixys.analytics.consent";
export const ANALYTICS_CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

interface CookieReader {
  get(name: string): { value: string } | undefined;
}

export function readAnalyticsConsent(cookies: CookieReader): ConsentState {
  const encoded = cookies.get(ANALYTICS_CONSENT_COOKIE)?.value;
  if (!encoded) return "unknown";

  const [state, issuedAtValue, signature] = encoded.split(".");
  if (!isConsentState(state) || !issuedAtValue || !signature) return "unknown";

  const issuedAt = Number(issuedAtValue);
  const now = Math.floor(Date.now() / 1_000);
  if (
    !Number.isSafeInteger(issuedAt) ||
    issuedAt > now + 60 ||
    now - issuedAt > ANALYTICS_CONSENT_MAX_AGE_SECONDS
  ) {
    return "unknown";
  }

  const expected = sign(`${state}.${issuedAtValue}`);
  return safeEqual(signature, expected) ? state : "unknown";
}

export function createAnalyticsConsentCookie(state: ConsentState): string {
  if (state === "unknown") {
    throw new TypeError("Unknown consent must be represented by deleting the cookie");
  }
  const issuedAt = Math.floor(Date.now() / 1_000);
  const payload = `${state}.${issuedAt}`;
  return `${payload}.${sign(payload)}`;
}

function isConsentState(value: string | undefined): value is ConsentState {
  return value === "granted" || value === "denied";
}

function sign(value: string): string {
  return createHmac("sha256", consentSecret()).update(value).digest("base64url");
}

function consentSecret(): string {
  const secret = process.env.ANALYTICS_CONSENT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ANALYTICS_CONSENT_SECRET is required in production");
  }
  return "checkpoint-development-analytics-consent-secret";
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

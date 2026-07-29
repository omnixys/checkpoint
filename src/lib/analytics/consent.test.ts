import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ANALYTICS_CONSENT_COOKIE,
  createAnalyticsConsentCookie,
  readAnalyticsConsent,
} from "./consent";

describe("analytics consent cookie", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("accepts a valid signed value", () => {
    vi.setSystemTime(new Date("2026-07-29T12:00:00Z"));
    const value = createAnalyticsConsentCookie("granted");

    expect(readAnalyticsConsent(reader(value))).toBe("granted");
  });

  it("rejects a manipulated value", () => {
    vi.setSystemTime(new Date("2026-07-29T12:00:00Z"));
    const value = createAnalyticsConsentCookie("granted").replace("granted", "denied");

    expect(readAnalyticsConsent(reader(value))).toBe("unknown");
  });
});

function reader(value: string) {
  return {
    get(name: string) {
      return name === ANALYTICS_CONSENT_COOKIE ? { value } : undefined;
    },
  };
}

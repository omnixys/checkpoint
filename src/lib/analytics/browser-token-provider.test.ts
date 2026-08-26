import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchAnalyticsToken } from "./browser-token-provider";

describe("fetchAnalyticsToken", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the token from the same-origin proxy", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ token: "browser-token", expiresIn: 3600 }));
    vi.stubGlobal("fetch", fetchMock);

    const token = await fetchAnalyticsToken();

    expect(token).toBe("browser-token");
    expect(fetchMock).toHaveBeenCalledWith("/api/analytics/token", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ publicReference: undefined }),
    });
  });

  it("accepts an optional forceRefresh request parameter", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ token: "browser-token", expiresIn: 3600 }));
    vi.stubGlobal("fetch", fetchMock);

    const token = await fetchAnalyticsToken({ forceRefresh: true });

    expect(token).toBe("browser-token");
  });

  it("returns an empty token on HTTP failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("unavailable", { status: 502 })));

    await expect(fetchAnalyticsToken()).resolves.toBe("");
  });

  it("returns an empty token on malformed payloads", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ nope: true })));

    await expect(fetchAnalyticsToken()).resolves.toBe("");
  });

  it("returns an empty token when the request itself fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

    await expect(fetchAnalyticsToken()).resolves.toBe("");
  });
});

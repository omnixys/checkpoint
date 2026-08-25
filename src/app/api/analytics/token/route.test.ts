import { beforeEach, describe, expect, it, vi } from "vitest";

const headerMap = vi.hoisted(() => new Map<string, string>());

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({
    get: (name: string) => headerMap.get(name.toLowerCase()) ?? null,
  })),
}));

vi.mock("@/checkpoint/config/env.server", () => ({
  env: {
    IS_PRODUCTION: false,
    ANALYTICS_API_URL: "http://analytics.local",
    ANALYTICS_INTERNAL_TOKEN: "test-internal-token",
  },
}));

const { POST } = await import("./route");

function sameOriginHeaders(): void {
  headerMap.clear();
  headerMap.set("origin", "http://localhost:3000");
  headerMap.set("host", "localhost:3000");
}

describe("POST /api/analytics/token", () => {
  beforeEach(() => {
    sameOriginHeaders();
    vi.unstubAllGlobals();
  });

  it("rejects cross-origin requests without calling upstream", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    headerMap.set("origin", "https://evil.example");

    const response = await POST();

    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("forwards an internal token request and returns the token", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ token: "browser-token", expiresIn: 3600 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST();
    const payload = (await response.json()) as { token?: string; expiresIn?: number };

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(payload).toEqual({ token: "browser-token", expiresIn: 3600 });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://analytics.local/v1/analytics/tokens",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "x-internal-token": "test-internal-token",
          "x-tenant-id": "6e788f7f-c233-4cb8-bbde-c0b855e564be",
        }),
      }),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(
      (fetchMock.mock.calls[0]![1] as RequestInit).body as string,
    ) as Record<string, unknown>;
    expect(body.application).toBe("checkpoint");
    expect(body.origin).toBe("http://localhost:3000");
    expect(body.environment).toBe("DEVELOPMENT");
    expect(body.events).toContain("$pageview");
  });

  it("maps upstream failures to a generic 502", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("denied", { status: 401 })));

    const response = await POST();
    const payload = (await response.json()) as { code?: string };

    expect(response.status).toBe(502);
    expect(payload.code).toBe("ANALYTICS_UNAVAILABLE");
  });

  it("maps network failures to a generic 502", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

    const response = await POST();
    const payload = (await response.json()) as { code?: string };

    expect(response.status).toBe(502);
    expect(payload.code).toBe("ANALYTICS_UNAVAILABLE");
  });

  it("rejects responses without a token with a generic 502", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ unexpected: true })));

    const response = await POST();

    expect(response.status).toBe(502);
  });
});

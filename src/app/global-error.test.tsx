import { beforeEach, describe, expect, it, vi } from "vitest";

const { initializeBrowserTracing } = vi.hoisted(() => ({
  initializeBrowserTracing: vi.fn().mockResolvedValue({ shutdown: vi.fn() }),
}));

vi.mock("@omnixys/observability-ts/browser", () => ({
  initializeBrowserTracing,
}));

vi.mock("@/checkpoint/lib/env", () => ({
  env: {
    IS_PRODUCTION: true,
    NODE_ENV: "production",
    OTEL_ENDPOINT: "https://api.omnixys.com/otel/v1/traces",
    OTEL_SERVICE_NAME: "checkpoint-web",
  },
}));

describe("global error tracing", () => {
  beforeEach(() => {
    initializeBrowserTracing.mockClear();
    vi.resetModules();
  });

  it("exports fallback-error traces through the public collector", async () => {
    await import("./global-error");

    expect(initializeBrowserTracing).toHaveBeenCalledWith({
      enabled: true,
      environment: "production",
      instrumentations: [],
      otlpEndpoint: "https://api.omnixys.com/otel/v1/traces",
      sampleRate: 1,
      serviceName: "checkpoint-web",
    });
  });
});

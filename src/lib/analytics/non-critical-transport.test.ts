import { AnalyticsTransportError } from "@omnixys/analytics-sdk";
import { describe, expect, it, vi } from "vitest";
import { nonCriticalAnalyticsTransport } from "./non-critical-transport";

describe("nonCriticalAnalyticsTransport", () => {
  it("drops telemetry backpressure without rejecting", async () => {
    const send = vi.fn().mockRejectedValue(new AnalyticsTransportError("limited", 429));
    await expect(nonCriticalAnalyticsTransport({ send }).send({ batchId: "b", sentAt: "now", events: [] })).resolves.toBeUndefined();
  });

  it("preserves non-rate-limit failures", async () => {
    const send = vi.fn().mockRejectedValue(new AnalyticsTransportError("unavailable", 503));
    await expect(nonCriticalAnalyticsTransport({ send }).send({ batchId: "b", sentAt: "now", events: [] })).rejects.toThrow("unavailable");
  });
});

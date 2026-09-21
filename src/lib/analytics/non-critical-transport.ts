import { AnalyticsTransportError, type AnalyticsTransport } from "@omnixys/analytics-sdk";

/** Browser telemetry must never surface backpressure as an application error. */
export function nonCriticalAnalyticsTransport(transport: AnalyticsTransport): AnalyticsTransport {
  return {
    async send(batch) {
      try {
        await transport.send(batch);
      } catch (error) {
        if (error instanceof AnalyticsTransportError && error.status === 429) return;
        throw error;
      }
    },
  };
}

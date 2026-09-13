import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GateDirection } from "@/checkpoint/generated/graphql";
import { useScanTicket } from "@/checkpoint/hooks/scan/useScanTicket";

const mocks = vi.hoisted(() => ({
  scanMutation: vi.fn(),
  track: vi.fn(),
}));

vi.mock("@apollo/client/react", () => ({
  useMutation: () => [mocks.scanMutation],
}));

vi.mock("@/checkpoint/providers/AnalyticsProvider", () => ({
  useAnalytics: () => ({ track: mocks.track }),
}));

const PAYLOAD = JSON.stringify({ token: "token-1", signature: "sig-1", deviceId: "device-1" });

describe("useScanTicket", () => {
  beforeEach(() => vi.clearAllMocks());

  it("scans with the requested direction and passes through parsed QR fields", async () => {
    mocks.scanMutation.mockResolvedValueOnce({
      data: { scanToken: { verdict: "OK", message: "Access granted", ticket: null, log: null } },
    });
    const { result } = renderHook(() => useScanTicket());

    await act(async () => {
      await result.current(PAYLOAD, { direction: GateDirection.EXIT });
    });

    expect(mocks.scanMutation).toHaveBeenCalledOnce();
    expect(mocks.track).toHaveBeenCalledWith("QrScanStarted");
    const variables = mocks.scanMutation.mock.calls[0]?.[0]?.variables;
    expect(variables).toEqual({
      input: {
        token: "token-1",
        signature: "sig-1",
        deviceId: "device-1",
        gate: "MAIN_GATE",
        direction: GateDirection.EXIT,
      },
    });
  });

  it("returns null and skips the mutation for unparsable QR content", async () => {
    const { result } = renderHook(() => useScanTicket());

    let outcome: unknown;
    await act(async () => {
      outcome = await result.current("not-json", { direction: GateDirection.ENTRY });
    });

    expect(outcome).toBeNull();
    expect(mocks.scanMutation).not.toHaveBeenCalled();
  });

  it("returns the payload on failure-free scans and null when the query errors", async () => {
    mocks.scanMutation.mockRejectedValueOnce(new Error("network down"));
    const { result } = renderHook(() => useScanTicket());

    await expect(
      act(async () => {
        await result.current(PAYLOAD, { direction: GateDirection.ENTRY });
      }),
    ).rejects.toThrow("network down");
  });
});

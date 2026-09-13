import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PresenceState } from "@/checkpoint/generated/graphql";
import { useUpdateTicketPresence } from "@/checkpoint/hooks/ticket/useUpdateTicketPresence";

const mocks = vi.hoisted(() => ({
  updateMutation: vi.fn(),
}));

vi.mock("@apollo/client/react", () => ({
  useMutation: () => [mocks.updateMutation],
}));

describe("useUpdateTicketPresence", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sends the requested presence state for the ticket", async () => {
    mocks.updateMutation.mockResolvedValueOnce({
      data: { updateTicketPresence: { __typename: "TicketPayload" } },
    });
    const { result } = renderHook(() => useUpdateTicketPresence());

    await act(async () => {
      await result.current("ticket-1", PresenceState.OUTSIDE);
    });

    expect(mocks.updateMutation).toHaveBeenCalledOnce();
    expect(mocks.updateMutation.mock.calls[0]?.[0]?.variables).toEqual({
      input: { ticketId: "ticket-1", state: PresenceState.OUTSIDE },
    });
  });

  it("returns the updated ticket payload", async () => {
    const payload = { __typename: "TicketPayload", currentState: PresenceState.INSIDE };
    mocks.updateMutation.mockResolvedValueOnce({
      data: { updateTicketPresence: payload },
    });
    const { result } = renderHook(() => useUpdateTicketPresence());

    let outcome: unknown;
    await act(async () => {
      outcome = await result.current("ticket-1", PresenceState.INSIDE);
    });

    expect(outcome).toEqual(payload);
  });

  it("propagates mutation errors to the caller", async () => {
    mocks.updateMutation.mockRejectedValueOnce(new Error("forbidden"));
    const { result } = renderHook(() => useUpdateTicketPresence());

    await expect(
      act(async () => {
        await result.current("ticket-1", PresenceState.INSIDE);
      }),
    ).rejects.toThrow("forbidden");
  });
});

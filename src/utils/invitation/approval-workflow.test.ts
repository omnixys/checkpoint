import { describe, expect, it, vi } from "vitest";
import { InvitationStatus } from "@/checkpoint/generated/graphql";
import {
  dispatchApprovalMutation,
  isFinalizableInvitationStatus,
  isStageableInvitationStatus,
  toggleInvitationSelection,
} from "./approval-workflow";

describe("invitation approval workflow", () => {
  it("selects a parent without changing any plus-one selection", () => {
    expect(toggleInvitationSelection(["plus-one-1"], "parent-1")).toEqual([
      "plus-one-1",
      "parent-1",
    ]);
    expect(toggleInvitationSelection(["plus-one-1", "parent-1"], "parent-1")).toEqual([
      "plus-one-1",
    ]);
  });

  it("only stages pending or accepted invitations", () => {
    expect(isStageableInvitationStatus(InvitationStatus.PENDING)).toBe(true);
    expect(isStageableInvitationStatus(InvitationStatus.ACCEPTED)).toBe(true);
    expect(isStageableInvitationStatus(InvitationStatus.APPROVAL_STAGED)).toBe(false);
    expect(isStageableInvitationStatus(InvitationStatus.APPROVED)).toBe(false);
  });

  it("only finalizes staged invitations", () => {
    expect(isFinalizableInvitationStatus(InvitationStatus.APPROVAL_STAGED)).toBe(true);
    expect(isFinalizableInvitationStatus(InvitationStatus.ACCEPTED)).toBe(false);
  });

  it("stages without ever invoking final approval", async () => {
    const stage = vi.fn().mockResolvedValue(undefined);
    const approve = vi.fn().mockResolvedValue(undefined);

    await dispatchApprovalMutation("stage", ["invitation-1"], {}, { stage, approve });

    expect(stage).toHaveBeenCalledWith({
      invitationIds: [{ invitationId: "invitation-1" }],
      staged: true,
    });
    expect(approve).not.toHaveBeenCalled();
  });

  it("finalizes only the supplied staged ids and preserves their seat choices", async () => {
    const stage = vi.fn().mockResolvedValue(undefined);
    const approve = vi.fn().mockResolvedValue(undefined);

    await dispatchApprovalMutation(
      "finalize",
      ["staged-1"],
      { "staged-1": { invitationId: "staged-1", seatId: "seat-7" } },
      { stage, approve },
    );

    expect(stage).not.toHaveBeenCalled();
    expect(approve).toHaveBeenCalledWith({
      invitationIds: [{ invitationId: "staged-1", seatId: "seat-7" }],
      approved: true,
    });
  });
});

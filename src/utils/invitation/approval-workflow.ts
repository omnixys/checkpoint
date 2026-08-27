import { InvitationStatus } from "@/checkpoint/generated/graphql";

export function toggleInvitationSelection(selected: readonly string[], id: string): string[] {
  return selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id];
}

export function isStageableInvitationStatus(status: InvitationStatus): boolean {
  return status === InvitationStatus.PENDING || status === InvitationStatus.ACCEPTED;
}

export function isFinalizableInvitationStatus(status: InvitationStatus): boolean {
  return status === InvitationStatus.APPROVAL_STAGED;
}

type ApprovalEntry = {
  invitationId: string;
  seatId: string | null;
};

export async function dispatchApprovalMutation(
  mode: "stage" | "finalize",
  invitationIds: string[],
  entries: Record<string, ApprovalEntry>,
  mutations: {
    stage: (input: {
      invitationIds: Array<{ invitationId: string }>;
      staged: boolean;
    }) => Promise<unknown>;
    approve: (input: {
      invitationIds: Array<{ invitationId: string; seatId: string | null }>;
      approved: boolean;
    }) => Promise<unknown>;
  },
) {
  if (mode === "stage") {
    return mutations.stage({
      invitationIds: invitationIds.map((invitationId) => ({ invitationId })),
      staged: true,
    });
  }

  return mutations.approve({
    invitationIds: invitationIds.map((invitationId) => {
      const entry = entries[invitationId];
      if (!entry) {
        throw new Error(`Missing approval entry for ${invitationId}`);
      }
      return { invitationId: entry.invitationId, seatId: entry.seatId };
    }),
    approved: true,
  });
}

import type { AssignSeatInput } from "@/checkpoint/generated/graphql";

export type SeatAssignmentChoice = {
  id: string;
  kind: "guest" | "staged" | "invitation";
} | null;

export function buildSeatAssignmentInput(
  seatId: string,
  assignment: SeatAssignmentChoice,
  note: string,
): AssignSeatInput {
  return {
    seatId,
    invitationId:
      assignment?.kind === "invitation" || assignment?.kind === "staged" ? assignment.id : null,
    guestId: assignment?.kind === "guest" ? assignment.id : null,
    note: note.trim() || null,
  };
}

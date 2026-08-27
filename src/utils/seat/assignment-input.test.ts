import { describe, expect, it } from "vitest";
import { buildSeatAssignmentInput } from "./assignment-input";

describe("buildSeatAssignmentInput", () => {
  it("assigns a ticket guest and keeps a note", () => {
    expect(buildSeatAssignmentInput("seat-1", { id: "guest-1", kind: "guest" }, " VIP ")).toEqual({
      seatId: "seat-1",
      guestId: "guest-1",
      invitationId: null,
      note: "VIP",
    });
  });

  it.each(["invitation", "staged"] as const)("assigns an %s holder by invitation id", (kind) => {
    expect(buildSeatAssignmentInput("seat-1", { id: "inv-1", kind }, "")).toEqual({
      seatId: "seat-1",
      guestId: null,
      invitationId: "inv-1",
      note: null,
    });
  });

  it("clears the holder while retaining an explicit note", () => {
    expect(buildSeatAssignmentInput("seat-1", null, "Reserved for accessibility")).toEqual({
      seatId: "seat-1",
      guestId: null,
      invitationId: null,
      note: "Reserved for accessibility",
    });
  });
});

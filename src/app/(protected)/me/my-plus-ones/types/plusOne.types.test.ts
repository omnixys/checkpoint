import { describe, expect, it } from "vitest";
import { InvitationStatus } from "@/checkpoint/generated/graphql";
import { isApprovedPlusOneStatus } from "./plusOne.types";

describe("isApprovedPlusOneStatus", () => {
  it("locks approved plus-ones", () => {
    expect(isApprovedPlusOneStatus(InvitationStatus.APPROVED)).toBe(true);
    expect(isApprovedPlusOneStatus(InvitationStatus.ACCEPTED)).toBe(true);
  });

  it("keeps open plus-ones editable", () => {
    expect(isApprovedPlusOneStatus(InvitationStatus.PENDING)).toBe(false);
    expect(isApprovedPlusOneStatus(InvitationStatus.APPROVAL_STAGED)).toBe(false);
    expect(isApprovedPlusOneStatus(InvitationStatus.REJECTED)).toBe(false);
    expect(isApprovedPlusOneStatus(InvitationStatus.DECLINED)).toBe(false);
    expect(isApprovedPlusOneStatus(InvitationStatus.CANCELED)).toBe(false);
  });

  it("treats missing status as editable", () => {
    expect(isApprovedPlusOneStatus(null)).toBe(false);
    expect(isApprovedPlusOneStatus(undefined)).toBe(false);
  });
});

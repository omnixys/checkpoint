import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import { InvitationStatus } from "@/checkpoint/generated/graphql";
import commonEn from "../../../messages/en/common.json";
import invitationEn from "../../../messages/en/invitation.json";
import InvitationStatusChip from "./InvitationStatusChip";

function renderChip(status: InvitationStatus, verified = false) {
  return render(
    <NextIntlClientProvider messages={{ invitation: invitationEn, common: commonEn }} locale="en">
      <InvitationStatusChip status={status} rsvp={undefined} verified={verified} />
    </NextIntlClientProvider>,
  );
}

describe("InvitationStatusChip", () => {
  it("shows APPROVED label when the guest is not verified", () => {
    renderChip(InvitationStatus.APPROVED, false);
    expect(screen.getByText("approved")).toBeInTheDocument();
  });

  it("shows VERIFIED when an approved guest has a verified account", () => {
    renderChip(InvitationStatus.APPROVED, true);
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });

  it("keeps the default label for non-APPROVED statuses even when verified", () => {
    renderChip(InvitationStatus.PENDING, true);
    expect(screen.getByText("pending")).toBeInTheDocument();
    renderChip(InvitationStatus.ACCEPTED, true);
    expect(screen.getByText("Accepted")).toBeInTheDocument();
  });
});

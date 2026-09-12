import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import type { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import commonEn from "../../../../messages/en/common.json";
import invitationEn from "../../../../messages/en/invitation.json";
import InvitationBulkApproveDialog from "./InvitationBulkApproveDialog";

function stubLogic(overrides: Partial<InvitationLogic> = {}): InvitationLogic {
  return {
    approveOpen: true,
    approvalDialogMode: "finalize",
    approvalMutationLoading: false,
    bulkApproveEntries: {},
    bulkApproveIds: ["inv-1"],
    bulkApproveInvitationList: [
      {
        id: "inv-1",
        firstName: "Maria",
        lastName: "Müller",
        eventId: "evt-1",
        eventName: "Hochzeit",
        status: "APPROVAL_STAGED",
        maxInvitees: 0,
      } as InvitationLogic["bulkApproveInvitationList"][number],
    ],
    bulkApproveLocales: { "inv-1": "de-DE" },
    eventNameById: { "evt-1": "Hochzeit" },
    seatOptionsByEventId: { "evt-1": [] },
    closeBulkApproveDialog: vi.fn(),
    setBulkApproveLocale: vi.fn(),
    setBulkApproveSeat: vi.fn(),
    submitApprovalDialog: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  } as unknown as InvitationLogic;
}

function renderWithI18n(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider messages={{ invitation: invitationEn, common: commonEn }} locale="en">
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("InvitationBulkApproveDialog", () => {
  it("renders locale select in finalize mode", () => {
    renderWithI18n(<InvitationBulkApproveDialog logic={stubLogic()} />);
    expect(screen.getByRole("combobox", { name: "Language" })).toBeInTheDocument();
  });

  it("does NOT render locale select in stage mode", () => {
    renderWithI18n(
      <InvitationBulkApproveDialog logic={stubLogic({ approvalDialogMode: "stage" })} />,
    );
    expect(screen.queryByRole("combobox", { name: "Language" })).not.toBeInTheDocument();
  });

  it("defaults to the value from bulkApproveLocales", () => {
    renderWithI18n(
      <InvitationBulkApproveDialog
        logic={stubLogic({ bulkApproveLocales: { "inv-1": "en-US" } })}
      />,
    );
    expect(screen.getByRole("combobox", { name: "Language" })).toHaveTextContent("English");
  });

  it("calls setBulkApproveLocale on change", () => {
    const setBulkApproveLocale = vi.fn();
    renderWithI18n(<InvitationBulkApproveDialog logic={stubLogic({ setBulkApproveLocale })} />);

    const select = screen.getByRole("combobox", { name: "Language" });

    fireEvent.mouseDown(select);
    fireEvent.click(screen.getByRole("option", { name: "English" }));

    expect(setBulkApproveLocale).toHaveBeenCalledWith("inv-1", "en-US");
  });
});

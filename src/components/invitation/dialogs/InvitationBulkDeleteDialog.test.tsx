import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import invitationEn from "../../../../messages/en/invitation.json";
import InvitationBulkDeleteDialog from "./InvitationBulkDeleteDialog";

function stubLogic(overrides: Partial<InvitationLogic> = {}): InvitationLogic {
  return {
    bulkDeleteIds: ["inv-1", "inv-2"],
    closeBulkDeleteDialog: vi.fn(),
    submitBulkDelete: vi.fn().mockResolvedValue(undefined),
    removeInvitationsLoading: false,
    ...overrides,
  } as unknown as InvitationLogic;
}

function renderWithI18n(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider messages={{ invitation: invitationEn }} locale="en">
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("InvitationBulkDeleteDialog", () => {
  afterEach(cleanup);

  it("shows the selected count in the title and the warning message", () => {
    renderWithI18n(<InvitationBulkDeleteDialog logic={stubLogic()} />);

    expect(screen.getByText("Delete 2 invitations?")).toBeInTheDocument();
    expect(screen.getByText(/permanently delete the 2 selected invitations/)).toBeInTheDocument();
  });

  it("submits the selected ids on confirm and closes", async () => {
    const submitBulkDelete = vi.fn().mockResolvedValue(undefined);
    const closeBulkDeleteDialog = vi.fn();
    renderWithI18n(
      <InvitationBulkDeleteDialog logic={stubLogic({ submitBulkDelete, closeBulkDeleteDialog })} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Yes, delete" }));

    expect(submitBulkDelete).toHaveBeenCalledWith(["inv-1", "inv-2"]);
  });

  it("closes without deleting when cancelled", () => {
    const closeBulkDeleteDialog = vi.fn();
    const submitBulkDelete = vi.fn();
    renderWithI18n(
      <InvitationBulkDeleteDialog logic={stubLogic({ closeBulkDeleteDialog, submitBulkDelete })} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(closeBulkDeleteDialog).toHaveBeenCalled();
    expect(submitBulkDelete).not.toHaveBeenCalled();
  });

  it("is rendered as a modal for an empty selection", () => {
    renderWithI18n(<InvitationBulkDeleteDialog logic={stubLogic({ bulkDeleteIds: [] })} />);

    expect(screen.queryByText(/permanently delete/)).not.toBeInTheDocument();
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import type { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import commonEn from "../../../../messages/en/common.json";
import invitationEn from "../../../../messages/en/invitation.json";
import InvitationResendDialog from "./InvitationResendDialog";

function stubLogic(overrides: Partial<InvitationLogic> = {}): InvitationLogic {
  return {
    resendIds: ["inv-1"],
    resendLocale: "de-DE",
    setResendLocale: vi.fn(),
    resendResult: null,
    closeBulkResendDialog: vi.fn(),
    resendConfirmations: vi.fn().mockResolvedValue(undefined),
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

describe("InvitationResendDialog", () => {
  it("renders locale select before resending", () => {
    renderWithI18n(<InvitationResendDialog logic={stubLogic()} />);
    expect(screen.getByRole("combobox", { name: "Language" })).toBeInTheDocument();
  });

  it("defaults to the value from resendLocale", () => {
    renderWithI18n(<InvitationResendDialog logic={stubLogic({ resendLocale: "en-US" })} />);
    expect(screen.getByRole("combobox", { name: "Language" })).toHaveTextContent("English");
  });

  it("calls setResendLocale on change", () => {
    const setResendLocale = vi.fn();
    renderWithI18n(<InvitationResendDialog logic={stubLogic({ setResendLocale })} />);

    const select = screen.getByRole("combobox", { name: "Language" });

    fireEvent.mouseDown(select);
    fireEvent.click(screen.getByRole("option", { name: "English" }));

    expect(setResendLocale).toHaveBeenCalledWith("en-US");
  });

  it("resends with the selected locale", () => {
    const resendConfirmations = vi.fn().mockResolvedValue(undefined);
    renderWithI18n(
      <InvitationResendDialog logic={stubLogic({ resendLocale: "en-US", resendConfirmations })} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Send again (1)" }));

    expect(resendConfirmations).toHaveBeenCalledWith(["inv-1"]);
  });

  it("does NOT render locale select after a result is shown", () => {
    renderWithI18n(
      <InvitationResendDialog
        logic={stubLogic({ resendResult: { total: 1, resent: 1, skipped: 0 } })}
      />,
    );
    expect(screen.queryByRole("combobox", { name: "Language" })).not.toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });
});

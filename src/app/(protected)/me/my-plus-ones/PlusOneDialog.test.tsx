import { ThemeProvider } from "@mui/material/styles";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createAppTheme } from "@/checkpoint/themes/createAppTheme";
import commonEn from "../../../../../messages/en/common.json";
import invitationEn from "../../../../../messages/en/invitation.json";
import PlusOneDialog from "./PlusOneDialog";
import type { PlusOneItem } from "./types/plusOne.types";

function makePlusOne(overrides: Partial<PlusOneItem> = {}): PlusOneItem {
  return {
    id: "plus-one-1",
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@lovelace.dev",
    status: "PENDING",
    plusOneAgeCategory: "OVER_SIX",
    phoneNumbers: [
      { countryCode: "+49", number: "01701234567", type: "WHATSAPP", label: null, isPrimary: true },
    ],
    ...overrides,
  } as PlusOneItem;
}

function renderDialog(initialValue: PlusOneItem | null) {
  const onUpdate = vi.fn().mockResolvedValue(undefined);
  const onCreate = vi.fn().mockResolvedValue(undefined);

  const view = render(
    <ThemeProvider theme={createAppTheme("light")}>
      <NextIntlClientProvider messages={{ invitation: invitationEn, common: commonEn }} locale="en">
        <PlusOneDialog
          open={true}
          mode="edit"
          initialValue={initialValue}
          onClose={vi.fn()}
          onCreate={onCreate}
          onUpdate={onUpdate}
        />
      </NextIntlClientProvider>
    </ThemeProvider>,
  );

  return { ...view, onUpdate, onCreate };
}

describe("PlusOneDialog (my plus ones)", () => {
  afterEach(cleanup);

  it("locks name, email and age category for approved plus-ones but keeps the phone editable", () => {
    renderDialog(makePlusOne({ status: "APPROVED" }));

    expect(screen.getByText(invitationEn.plusOnes.dialog.lockedHint)).toBeInTheDocument();
    expect(screen.getByLabelText("First name")).toBeDisabled();
    expect(screen.getByLabelText("Last name")).toBeDisabled();
    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByRole("radio", { name: "Over 6" })).toBeDisabled();
    expect(screen.getByLabelText("Phone number")).toBeEnabled();
  });

  it("keeps the whole form editable for open plus-ones", () => {
    renderDialog(makePlusOne());

    expect(screen.queryByText(invitationEn.plusOnes.dialog.lockedHint)).not.toBeInTheDocument();
    expect(screen.getByLabelText("First name")).toBeEnabled();
    expect(screen.getByLabelText("Last name")).toBeEnabled();
    expect(screen.getByLabelText("Email")).toBeEnabled();
    expect(screen.getByLabelText("Phone number")).toBeEnabled();
  });

  it("submits the original identity and only the edited phone for approved plus-ones", () => {
    const { onUpdate } = renderDialog(makePlusOne({ status: "APPROVED" }));

    fireEvent.change(screen.getByLabelText("Phone number"), {
      target: { value: "01719999999" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "plus-one-1",
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@lovelace.dev",
        plusOneAgeCategory: "OVER_SIX",
        phoneNumbers: [expect.objectContaining({ number: "01719999999", countryCode: "+49" })],
      }),
    );
  });

  it("strips letters and special characters from the phone number while typing", () => {
    renderDialog(makePlusOne({ status: "APPROVED" }));

    const phone = screen.getByLabelText("Phone number");
    fireEvent.change(phone, { target: { value: "abc0170!-def12345" } });

    expect(phone).toHaveValue("017012345");
  });

  it("keeps only digits and a single leading plus in the country code while typing", () => {
    renderDialog(makePlusOne({ status: "APPROVED" }));

    const code = screen.getByLabelText("Country code");
    fireEvent.change(code, { target: { value: "++49-030-456" } });

    expect(code).toHaveValue("+49030456");
  });
});

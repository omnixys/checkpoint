import { ThemeProvider } from "@mui/material/styles";
import { cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createAppTheme } from "@/checkpoint/themes/createAppTheme";
import invitationEn from "../../../../../messages/en/invitation.json";
import PlusOneCard from "./PlusOneCard";
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

function renderCard(plusOne: PlusOneItem) {
  return render(
    <ThemeProvider theme={createAppTheme("light")}>
      <NextIntlClientProvider messages={{ invitation: invitationEn }} locale="en">
        <PlusOneCard plusOne={plusOne} index={0} onEdit={vi.fn()} onDelete={vi.fn()} />
      </NextIntlClientProvider>
    </ThemeProvider>,
  );
}

describe("PlusOneCard", () => {
  afterEach(cleanup);

  it("keeps edit and delete for open plus-ones", () => {
    renderCard(makePlusOne());

    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit phone number" })).not.toBeInTheDocument();
  });

  it.each(["APPROVED", "ACCEPTED"] as const)(
    "locks approved <%s> plus-ones to phone-only editing",
    (status) => {
      renderCard(makePlusOne({ status }));

      expect(screen.getByRole("button", { name: "Edit phone number" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    },
  );
});

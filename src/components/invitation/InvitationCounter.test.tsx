import { ThemeProvider } from "@mui/material/styles";
import { cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it } from "vitest";
import { createAppTheme } from "@/checkpoint/themes/createAppTheme";
import commonEn from "../../../messages/en/common.json";
import invitationEn from "../../../messages/en/invitation.json";
import { InvitationCounter } from "./InvitationCounter";

function renderCounter(count: number) {
  return render(
    <ThemeProvider theme={createAppTheme("light")}>
      <NextIntlClientProvider messages={{ invitation: invitationEn, common: commonEn }} locale="en">
        <InvitationCounter count={count} />
      </NextIntlClientProvider>
    </ThemeProvider>,
  );
}

describe("InvitationCounter", () => {
  afterEach(cleanup);

  it("shows the invitation count", () => {
    renderCounter(42);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("exposes an accessible label with the count", () => {
    renderCounter(42);
    expect(screen.getByLabelText("42 invitations")).toBeInTheDocument();
  });

  it("shows zero when the list is empty", () => {
    renderCounter(0);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

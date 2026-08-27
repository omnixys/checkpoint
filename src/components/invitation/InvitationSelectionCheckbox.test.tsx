import { ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createAppTheme } from "@/checkpoint/themes/createAppTheme";
import InvitationSelectionCheckbox, {
  getInvitationSelectionColors,
} from "./InvitationSelectionCheckbox";

describe("InvitationSelectionCheckbox", () => {
  it.each(["light", "dark"] as const)("uses a visible theme-derived border in %s mode", (mode) => {
    const theme = createAppTheme(mode);
    const colors = getInvitationSelectionColors(theme);

    expect(colors.unchecked).toMatch(/^rgba?\(/);
    expect(colors.unchecked).not.toBe("rgba(0, 0, 0, 0)");
    expect(colors.active).toBe(theme.palette.primary.main);
  });

  it("exposes checked and indeterminate states and keeps a 40px click target", () => {
    const theme = createAppTheme("light");
    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <InvitationSelectionCheckbox
          checked={true}
          slotProps={{ input: { "aria-label": "selection" } }}
        />
      </ThemeProvider>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "selection" });
    expect(checkbox).toBeChecked();
    expect(checkbox.closest(".MuiCheckbox-root")).toHaveClass("Mui-checked");

    rerender(
      <ThemeProvider theme={theme}>
        <InvitationSelectionCheckbox
          checked={false}
          indeterminate={true}
          slotProps={{ input: { "aria-label": "selection" } }}
        />
      </ThemeProvider>,
    );

    const indeterminateCheckbox = screen.getByRole("checkbox", { name: "selection" });
    expect(indeterminateCheckbox.closest(".MuiCheckbox-root")).toHaveClass(
      "MuiCheckbox-indeterminate",
    );
    expect(indeterminateCheckbox.closest(".MuiCheckbox-root")).toHaveStyle({
      width: "40px",
      height: "40px",
    });
  });
});

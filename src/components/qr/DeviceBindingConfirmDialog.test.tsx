import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import qrEn from "../../../messages/en/qr.json";
import DeviceBindingConfirmDialog from "./DeviceBindingConfirmDialog";

afterEach(cleanup);

function renderDialog(
  overrides: Partial<React.ComponentProps<typeof DeviceBindingConfirmDialog>> = {},
) {
  const props: React.ComponentProps<typeof DeviceBindingConfirmDialog> = {
    open: true,
    onCancel: vi.fn(),
    onConfirm: vi.fn(),
    ...overrides,
  };

  return {
    ...render(
      <NextIntlClientProvider messages={{ qr: qrEn }} locale="en">
        <DeviceBindingConfirmDialog {...props} />
      </NextIntlClientProvider>,
    ),
    props,
  };
}

describe("DeviceBindingConfirmDialog", () => {
  it("renders the re-activation prompt while open", () => {
    renderDialog();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Re-activate this ticket on this device?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Re-activate" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("does not render anything while closed", () => {
    renderDialog({ open: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onConfirm when the confirm button is pressed", () => {
    const onConfirm = vi.fn();
    renderDialog({ onConfirm });

    fireEvent.click(screen.getByRole("button", { name: "Re-activate" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when the cancel button is pressed", () => {
    const onCancel = vi.fn();
    renderDialog({ onCancel });

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ResetTicketDeviceDialog from "./ResetTicketDeviceDialog";

afterEach(cleanup);

function renderDialog(overrides: Partial<React.ComponentProps<typeof ResetTicketDeviceDialog>> = {}) {
  const onCancel = vi.fn();
  const onConfirm = vi.fn();
  render(<ResetTicketDeviceDialog onCancel={onCancel} onConfirm={onConfirm} {...overrides} />);
  return { onCancel, onConfirm };
}

describe("ResetTicketDeviceDialog", () => {
  it("shows the binding reset prompt with cancel and confirm actions", () => {
    renderDialog();

    expect(screen.getByText("Gerätebindung zurücksetzen?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Abbrechen" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Zurücksetzen" })).toBeInTheDocument();
  });

  it("invokes onConfirm when staff confirm the reset", () => {
    const { onConfirm } = renderDialog();

    fireEvent.click(screen.getByRole("button", { name: "Zurücksetzen" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("invokes onCancel when staff cancel the reset", () => {
    const { onCancel } = renderDialog();

    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

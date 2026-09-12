import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import qrEn from "../../../messages/en/qr.json";
import QrZoomDialog from "./QrZoomDialog";

afterEach(cleanup);

const PAYLOAD = JSON.stringify({ token: "token-1", signature: "sig-1", deviceId: "device-1" });

function renderQrZoomDialog(overrides: Partial<React.ComponentProps<typeof QrZoomDialog>> = {}) {
  const props: React.ComponentProps<typeof QrZoomDialog> = {
    open: true,
    onClose: vi.fn(),
    payload: PAYLOAD,
    remainingSeconds: 30,
    eventName: "Checkpoint Gala",
    ...overrides,
  };

  return {
    ...render(
      <NextIntlClientProvider messages={{ qr: qrEn }} locale="en">
        <QrZoomDialog {...props} />
      </NextIntlClientProvider>,
    ),
    props,
  };
}

describe("QrZoomDialog", () => {
  it("renders the enlarged QR code inside an accessible dialog", () => {
    const { baseElement } = renderQrZoomDialog();

    const dialog = screen.getByRole("dialog", { name: "Checkpoint Gala" });
    expect(dialog).toBeInTheDocument();
    expect(baseElement.querySelector("canvas")).toBeInTheDocument();
  });

  it("does not render anything while closed", () => {
    renderQrZoomDialog({ open: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onClose when the close button is pressed", () => {
    const onClose = vi.fn();
    renderQrZoomDialog({ onClose });

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows the remaining validity while the QR is active", () => {
    renderQrZoomDialog({ remainingSeconds: 42 });

    expect(screen.getByText("Valid for 42s")).toBeInTheDocument();
  });

  it("shows the inactive hint once the QR expired", () => {
    renderQrZoomDialog({ remainingSeconds: 0 });

    expect(screen.getByText("No active QR code")).toBeInTheDocument();
  });
});

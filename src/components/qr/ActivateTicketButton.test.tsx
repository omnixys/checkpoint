import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import qrEn from "../../../messages/en/qr.json";
import ActivateTicketButton from "./ActivateTicketButton";

const mocks = vi.hoisted(() => ({
  activateMutation: vi.fn(),
  getDeviceHash: vi.fn(),
  createDeviceKeyPair: vi.fn(),
  saveDevicePrivateKey: vi.fn(),
  saveDeviceBindingMeta: vi.fn(),
}));

vi.mock("@apollo/client/react", () => ({
  useMutation: () => [mocks.activateMutation, { loading: false }],
}));

vi.mock("@/checkpoint/utils/ticket/device-utils", () => ({
  getDeviceHash: mocks.getDeviceHash,
  createDeviceKeyPair: mocks.createDeviceKeyPair,
  saveDevicePrivateKey: mocks.saveDevicePrivateKey,
  saveDeviceBindingMeta: mocks.saveDeviceBindingMeta,
}));

afterEach(cleanup);

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getDeviceHash.mockResolvedValue("device-1");
  mocks.createDeviceKeyPair.mockResolvedValue({ publicKey: "pub-1", privateKey: {} });
  mocks.saveDevicePrivateKey.mockResolvedValue(undefined);
  mocks.saveDeviceBindingMeta.mockResolvedValue(undefined);
});

const ACTIVATED_PAYLOAD = {
  data: {
    activateDevice: {
      __typename: "TicketPayload",
      eventId: "event-1",
      deviceActivationAt: "2026-09-16T12:00:00.000Z",
    },
  },
};

function renderButton(overrides: Partial<React.ComponentProps<typeof ActivateTicketButton>> = {}) {
  const props: React.ComponentProps<typeof ActivateTicketButton> = {
    ticketId: "ticket-1",
    onActivated: vi.fn(),
    ...overrides,
  };

  return {
    ...render(
      <NextIntlClientProvider messages={{ qr: qrEn }} locale="en">
        <ActivateTicketButton {...props} />
      </NextIntlClientProvider>,
    ),
    props,
  };
}

describe("ActivateTicketButton", () => {
  it("activates immediately and persists the key and binding meta when confirmation is not required", async () => {
    mocks.activateMutation.mockResolvedValue(ACTIVATED_PAYLOAD);
    const { props } = renderButton();

    fireEvent.click(screen.getByRole("button", { name: "Activate ticket on this device" }));

    await waitFor(() => {
      expect(mocks.activateMutation).toHaveBeenCalledWith({
        variables: { input: { ticketId: "ticket-1", deviceId: "device-1", publicKey: "pub-1" } },
      });
    });
    expect(mocks.saveDevicePrivateKey).toHaveBeenCalledWith("ticket-1", expect.any(Object));
    expect(mocks.saveDeviceBindingMeta).toHaveBeenCalledWith(
      "ticket-1",
      expect.objectContaining({
        ticketId: "ticket-1",
        eventId: "event-1",
        deviceId: "device-1",
      }),
    );
    expect(props.onActivated).toHaveBeenCalledTimes(1);
  });

  it("keeps a single in-flight activation when the button is pressed repeatedly", async () => {
    let resolveMutation: (value: unknown) => void;
    mocks.activateMutation.mockReturnValue(
      new Promise((resolve) => {
        resolveMutation = resolve;
      }),
    );
    renderButton();

    const button = screen.getByRole("button", { name: "Activate ticket on this device" });
    fireEvent.click(button);
    fireEvent.click(button);

    await waitFor(() => expect(mocks.activateMutation).toHaveBeenCalledTimes(1));
    expect(mocks.getDeviceHash).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveMutation(ACTIVATED_PAYLOAD);
    });
  });

  it("opens the confirmation dialog before activating when confirmation is required", async () => {
    mocks.activateMutation.mockResolvedValue(ACTIVATED_PAYLOAD);
    const onActivated = vi.fn();
    renderButton({ requireConfirmation: true, onActivated });

    fireEvent.click(screen.getByRole("button", { name: "Activate ticket on this device" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(mocks.activateMutation).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Re-activate" }));

    await waitFor(() => {
      expect(mocks.activateMutation).toHaveBeenCalledTimes(1);
    });
    expect(onActivated).toHaveBeenCalledTimes(1);
  });

  it("does not activate when the confirmation dialog is cancelled", async () => {
    renderButton({ requireConfirmation: true });

    fireEvent.click(screen.getByRole("button", { name: "Activate ticket on this device" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mocks.activateMutation).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("surfaces the failure alert when activation throws", async () => {
    mocks.activateMutation.mockRejectedValue(new Error("gateway offline"));
    const onActivated = vi.fn();
    renderButton({ onActivated });

    fireEvent.click(screen.getByRole("button", { name: "Activate ticket on this device" }));

    expect(
      await screen.findByText("Device activation failed. Please try again."),
    ).toBeInTheDocument();
    expect(onActivated).not.toHaveBeenCalled();
  });
});

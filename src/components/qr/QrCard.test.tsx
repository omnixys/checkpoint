import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { GetActiveEventQuery, GetMyFullTicketListQuery } from "@/checkpoint/generated/graphql";
import qrEn from "../../../messages/en/qr.json";
import ticketEn from "../../../messages/en/ticket.json";
import QrCard from "./QrCard";

const mocks = vi.hoisted(() => ({
  generateToken: vi.fn(),
  signQrMessage: vi.fn(),
  loadDevicePrivateKey: vi.fn(),
  searchParamsGet: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({ get: mocks.searchParamsGet }),
}));

vi.mock("next-intl", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next-intl")>();
  return {
    ...actual,
    useLocale: () => "en",
  };
});

vi.mock("@/checkpoint/providers/DeviceProvider", () => ({
  useDevice: () => ({ isMobile: false }),
}));

vi.mock("@/checkpoint/hooks/seat/useSeatQuery", () => ({
  default: () => ({
    fullSeatInfo: {
      __typename: "SeatPayload",
      id: "seat-1",
      label: "A1",
      number: 1,
      section: { __typename: "SectionPayload", id: "section-1", name: "Main" },
      table: null,
    },
  }),
}));

vi.mock("@/checkpoint/hooks/ticket/useGenerateTokenMutation", () => ({
  default: () => ({ generateToken: mocks.generateToken, generateTokenLoading: false }),
}));

vi.mock("@/checkpoint/utils/ticket/device-utils", () => ({
  loadDevicePrivateKey: mocks.loadDevicePrivateKey,
}));

vi.mock("@/checkpoint/utils/ticket/qr-signature", () => ({
  signQrMessage: mocks.signQrMessage,
}));

vi.mock("@/checkpoint/components/qr/ActivateTicketButton", () => ({
  default: ({ ticketId }: { ticketId: string }) => (
    <button type="button">activate-stub {ticketId}</button>
  ),
}));

afterEach(cleanup);

beforeEach(() => {
  vi.clearAllMocks();
  mocks.searchParamsGet.mockReturnValue(null);
  mocks.generateToken.mockResolvedValue({ data: { generateToken: "token-1" } });
  mocks.signQrMessage.mockResolvedValue("sig-1");
});

const TICKET_ACTIVATED: GetMyFullTicketListQuery["getMyTickets"][number] = {
  __typename: "TicketPayload",
  id: "ticket-1",
  eventId: "event-1",
  seatId: "seat-1",
  deviceId: "device-1",
  devicePublicKey: "pub-1",
  deviceActivationAt: "2026-09-16T12:00:00.000Z",
  currentState: "OUTSIDE" as GetMyFullTicketListQuery["getMyTickets"][number]["currentState"],
  revoked: false,
  revokedReason: null,
};

const TICKET_NOT_ACTIVATED: GetMyFullTicketListQuery["getMyTickets"][number] = {
  ...TICKET_ACTIVATED,
  deviceId: null,
  devicePublicKey: null,
  deviceActivationAt: null,
};

const EVENT: NonNullable<GetActiveEventQuery["event"]> = {
  __typename: "EventPayload",
  id: "event-1",
  name: "Checkpoint Gala",
  myRole: null,
  settings: {
    __typename: "SettingsPayload",
    id: "settings-1",
    allowGuestSeatSelection: false,
    startsAt: "2026-12-01T18:00:00.000Z",
    endsAt: "2026-12-01T23:00:00.000Z",
    invitedByOptions: [],
    visibleTabs: [],
  },
};

function renderCard({
  ticket = TICKET_ACTIVATED,
  event = EVENT,
}: {
  ticket?: GetMyFullTicketListQuery["getMyTickets"][number] | undefined;
  event?: GetActiveEventQuery["event"] | null | undefined;
} = {}) {
  return render(
    <NextIntlClientProvider messages={{ qr: qrEn, ticket: ticketEn }} locale="en">
      <QrCard ticket={ticket} event={event} />
    </NextIntlClientProvider>,
  );
}

describe("QrCard device key gating", () => {
  it("shows the activation intro when the ticket is not bound to a device", () => {
    renderCard({ ticket: TICKET_NOT_ACTIVATED });

    expect(screen.getByText("Secure this ticket")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "activate-stub ticket-1" })).toBeInTheDocument();
  });

  it("blocks the QR and shows the mismatch block when the stored key does not match the ticket", async () => {
    mocks.loadDevicePrivateKey.mockResolvedValue(null);
    const { container } = renderCard();

    expect(await screen.findByText("Device key mismatch")).toBeInTheDocument();
    expect(
      screen.getByText(
        "The key stored on this device no longer matches your ticket. Re-activate the ticket to generate a fresh QR code.",
      ),
    ).toBeInTheDocument();
    expect(mocks.generateToken).not.toHaveBeenCalled();
    expect(container.querySelector("canvas")).not.toBeInTheDocument();
  });

  it("reveals the QR once the stored key verifies against the bound public key", async () => {
    mocks.loadDevicePrivateKey.mockResolvedValue({} as CryptoKey);

    renderCard();

    await waitFor(() => {
      expect(mocks.loadDevicePrivateKey).toHaveBeenCalledWith("ticket-1", "pub-1");
    });
    await waitFor(() => {
      expect(mocks.generateToken).toHaveBeenCalled();
    });
    expect(screen.getByRole("button", { name: "Refresh QR code now" })).toBeInTheDocument();
  });
});

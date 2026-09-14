import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import RequestGuestConfirmationClient from "./RequestGuestConfirmationClient";

const mocks = vi.hoisted(() => ({
  mutate: vi.fn(),
  params: new URLSearchParams("eventId=event-1"),
}));

vi.mock("@apollo/client/react", () => ({
  useMutation: () => [mocks.mutate, { loading: false }],
}));
vi.mock("next/navigation", () => ({
  useSearchParams: () => mocks.params,
}));
vi.mock("@/checkpoint/i18n/useTypedTranslations", () => ({
  useTypedTranslations: () => (key: string) => key,
}));
vi.mock("@/checkpoint/components/apple/AppleCard", () => ({
  AppleCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/checkpoint/components/apple/AppleButton", () => ({
  AppleButton: ({ children, ...props }: { children: ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}));

describe("RequestGuestConfirmationClient", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.params = new URLSearchParams("eventId=event-1");
  });

  it("submits normalized invitation details and shows the neutral confirmation", async () => {
    mocks.mutate.mockResolvedValueOnce({ data: { requestGuestConfirmation: true } });
    render(<RequestGuestConfirmationClient />);

    fireEvent.change(screen.getByLabelText("confirmationRequest.firstName"), {
      target: { value: " Ada " },
    });
    fireEvent.change(screen.getByLabelText("confirmationRequest.lastName"), {
      target: { value: " Lovelace " },
    });
    fireEvent.change(screen.getByLabelText("confirmationRequest.identifier"), {
      target: { value: "Ada@Example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "confirmationRequest.submit" }));

    await waitFor(() =>
      expect(mocks.mutate).toHaveBeenCalledWith({
        variables: {
          input: {
            eventId: "event-1",
            firstName: "Ada",
            lastName: "Lovelace",
            identifier: "ada@example.com",
          },
        },
      }),
    );
    expect(await screen.findByText("confirmationRequest.sent")).toBeTruthy();
  });

  it("does not submit without a valid contact identifier", () => {
    render(<RequestGuestConfirmationClient />);
    fireEvent.click(screen.getByRole("button", { name: "confirmationRequest.submit" }));

    expect(mocks.mutate).not.toHaveBeenCalled();
    expect(screen.getByText("confirmationRequest.invalid")).toBeTruthy();
  });
});

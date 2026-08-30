import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { AppError, ErrorCode } from "@/checkpoint/errors/app-error";
import errorEn from "../../../messages/en/error.json";
import invitationEn from "../../../messages/en/invitation.json";
import ErrorCodeDialog from "./ErrorCodeDialog";
import RetryComponent from "./RetryComponent";
import SessionExpiredDialog from "./SessionExpiredDialog";

describe("error components", () => {
  it("renders and activates retry", () => {
    const retry = vi.fn();
    render(<RetryComponent open={true} title="Unavailable" message="Try later" onRetry={retry} />);
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it("shows correlation reference in the session dialog", () => {
    const onContinue = vi.fn();
    render(
      <SessionExpiredDialog
        open={true}
        error={
          new AppError({
            code: ErrorCode.REFRESH_TOKEN_EXPIRED,
            message: "Expired",
            requestId: "request-session",
          })
        }
        onContinue={onContinue}
      />,
    );
    expect(screen.getByText("Reference: request-session")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Continue to sign in" }));
    expect(onContinue).toHaveBeenCalledOnce();
  });

  it("renders a localized title and message for a known RSVP error code", () => {
    const onClose = vi.fn();
    render(
      <NextIntlClientProvider messages={{ invitation: invitationEn, error: errorEn }} locale="en">
        <ErrorCodeDialog
          open={true}
          error={
            new AppError({
              code: ErrorCode.RSVP_NOT_SUBMITTED,
              message: "backend text",
              requestId: "request-rsvp",
            })
          }
          onClose={onClose}
        />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("RSVP not submitted yet")).toBeInTheDocument();
    expect(screen.getByText(/has not submitted an RSVP/i)).toBeInTheDocument();
    expect(screen.getByText("Reference: request-rsvp")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});

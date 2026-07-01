import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppError, ErrorCode } from "@/checkpoint/errors/app-error";
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
});

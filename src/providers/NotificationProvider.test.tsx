import { cleanup, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppError, ErrorCode } from "@/checkpoint/errors/app-error";
import { notificationService } from "@/checkpoint/errors/notification.service";
import { NotificationProvider } from "./NotificationProvider";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  enqueueSnackbar: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push, replace: mocks.replace }),
}));

vi.mock("@/checkpoint/lib/env", () => ({
  env: { CHECKPOINT_BASE_PATH: "/" },
}));

vi.mock("notistack", () => ({
  SnackbarProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useSnackbar: () => ({ enqueueSnackbar: mocks.enqueueSnackbar }),
}));

afterEach(cleanup);
beforeEach(() => {
  notificationService.clear();
  vi.clearAllMocks();
});

const renderProvider = () =>
  render(
    <NotificationProvider onError={vi.fn()}>
      <div>page content</div>
    </NotificationProvider>,
  );

describe("NotificationProvider actions", () => {
  it("pushes to the login intercepting route for auth failures", () => {
    renderProvider();

    act(() => {
      notificationService.capture(
        new AppError({ code: ErrorCode.UNAUTHORIZED, message: "Unauthorized" }),
        { scope: "global" },
      );
    });

    expect(mocks.push).toHaveBeenCalledWith("/login", { scroll: false });
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it("replaces for regular redirects", () => {
    renderProvider();

    act(() => {
      notificationService.capture(
        new AppError({ code: ErrorCode.SERVICE_UNAVAILABLE, message: "Unavailable" }),
        { scope: "global" },
      );
    });

    expect(mocks.replace).toHaveBeenCalledWith("/error/maintenance");
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it("surfaces toasts for local business errors", () => {
    renderProvider();

    act(() => {
      notificationService.capture(
        new AppError({ code: ErrorCode.INTERNAL_SERVER_ERROR, message: "Unexpected" }),
      );
    });

    expect(mocks.enqueueSnackbar).toHaveBeenCalledWith("An unexpected error occurred", {
      variant: "error",
    });
    expect(mocks.push).not.toHaveBeenCalled();
    expect(mocks.replace).not.toHaveBeenCalled();
  });
});

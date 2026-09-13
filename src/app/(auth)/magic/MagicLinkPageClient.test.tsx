import { cleanup, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MagicLinkPageClient, { safeMagicLinkRedirect } from "./MagicLinkPageClient";

const mocks = vi.hoisted(() => ({
  params: new URLSearchParams(),
  replace: vi.fn(),
  verifyMagicLink: vi.fn(),
  getCurrentUser: vi.fn(),
  setCurrentUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace }),
  useSearchParams: () => mocks.params,
}));
vi.mock("@/checkpoint/lib/auth/AuthManager", () => ({
  AuthManager: { verifyMagicLink: mocks.verifyMagicLink },
}));
vi.mock("@/checkpoint/lib/auth/get-current-user", () => ({
  getCurrentUser: mocks.getCurrentUser,
}));
vi.mock("@/checkpoint/lib/apollo/auth-context", () => ({
  setCurrentUser: mocks.setCurrentUser,
}));
vi.mock("@/checkpoint/lib/env", () => ({
  env: { CHECKPOINT_BASE_PATH: "/" },
}));
vi.mock("@/checkpoint/i18n/useTypedTranslations", () => ({
  useTypedTranslations: () => (key: string) => key,
}));
vi.mock("@/checkpoint/components/apple/AppleCard", () => ({
  AppleCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/checkpoint/components/apple/AppleButton", () => ({
  AppleButton: ({ children, ...props }: { children: ReactNode }) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}));

describe("MagicLinkPageClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.params = new URLSearchParams();
  });
  afterEach(cleanup);

  it("uses only local redirects", () => {
    expect(safeMagicLinkRedirect("/event/ticket?view=qr")).toBe("/event/ticket?view=qr");
    expect(safeMagicLinkRedirect("https://attacker.invalid/path")).toBe("/me/my-qr");
    expect(safeMagicLinkRedirect("//attacker.invalid/path")).toBe("/me/my-qr");
  });

  it("shows the same public error for a missing token", async () => {
    render(<MagicLinkPageClient />);

    expect(await screen.findByText("magic.errorDescription")).toBeTruthy();
    expect(mocks.verifyMagicLink).not.toHaveBeenCalled();
  });

  it("verifies once, updates auth context and redirects to the ticket", async () => {
    mocks.params = new URLSearchParams("token=one-time-token");
    mocks.verifyMagicLink.mockResolvedValueOnce(undefined);
    mocks.getCurrentUser.mockResolvedValueOnce({ id: "guest-1" });
    render(<MagicLinkPageClient />);

    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/me/my-qr"));
    expect(mocks.verifyMagicLink).toHaveBeenCalledOnce();
    expect(mocks.verifyMagicLink).toHaveBeenCalledWith("one-time-token");
    expect(mocks.setCurrentUser).toHaveBeenCalledWith({ id: "guest-1" });
  });

  it("does not expose why verification failed", async () => {
    mocks.params = new URLSearchParams("token=expired-or-used");
    mocks.verifyMagicLink.mockRejectedValueOnce(new Error("already consumed"));
    render(<MagicLinkPageClient />);

    expect(await screen.findByText("magic.errorDescription")).toBeTruthy();
    expect(screen.queryByText("already consumed")).toBeNull();
  });
});

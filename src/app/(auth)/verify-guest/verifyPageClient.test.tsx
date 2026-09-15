import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { VerifyGuestSignUpMutation } from "@/checkpoint/generated/graphql";
import VerifyPageClient from "./verifyPageClient";

const successData: VerifyGuestSignUpMutation = {
  __typename: "Mutation",
  verifyGuestSignUp: {
    __typename: "GuestSignUpPayload",
    message: "ok",
    results: [
      {
        __typename: "SignUpResultsPayload",
        userId: "guest-1",
        username: "guest-user",
        password: "s3cret",
        email: "guest@example.com",
      },
    ],
  },
};

const mocks = vi.hoisted(() => ({
  mutate: vi.fn(),
  params: new URLSearchParams(),
  track: vi.fn(),
  failVerify: vi.fn(),
  deliverPdfBlob: vi.fn(),
  generateGuestCredentialsPdf: vi.fn(),
  login: vi.fn(),
  getCurrentUser: vi.fn(),
  setCurrentUser: vi.fn(),
  mutationResult: { data: null as VerifyGuestSignUpMutation | null, loading: false },
}));

vi.mock("@apollo/client/react", () => ({
  useMutation: () => [mocks.mutate, mocks.mutationResult],
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => mocks.params,
}));
vi.mock("@/checkpoint/i18n/useTypedTranslations", () => ({
  useTypedTranslations: () => (key: string) => key,
}));
vi.mock("@/checkpoint/hooks/error", () => ({
  useMutationError: mocks.failVerify,
}));
vi.mock("@/checkpoint/providers/AnalyticsProvider", () => ({
  useAnalytics: () => ({ track: mocks.track }),
}));
vi.mock("@/checkpoint/lib/auth/AuthManager", () => ({
  AuthManager: { login: mocks.login },
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
vi.mock("@/checkpoint/lib/ticket/ticket-pdf", () => ({
  isCoarsePointerDevice: () => false,
  generateGuestCredentialsPdf: mocks.generateGuestCredentialsPdf,
  deliverPdfBlob: mocks.deliverPdfBlob,
}));

describe("VerifyPageClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.params = new URLSearchParams("token=one-time-token");
    mocks.mutationResult.data = null;
    mocks.mutationResult.loading = false;
    mocks.mutate.mockResolvedValue({ data: null });
    mocks.failVerify.mockReturnValue(() => ({ message: "verify.failed" }));
    mocks.generateGuestCredentialsPdf.mockResolvedValue(new Blob(["guest"]));
    mocks.deliverPdfBlob.mockReturnValue("download");
  });

  afterEach(cleanup);

  it("downloads the guest credentials pdf automatically without a manual button", async () => {
    mocks.mutationResult.data = successData;
    render(<VerifyPageClient />);

    expect(await screen.findByText("verify.success")).toBeTruthy();

    await waitFor(() => expect(mocks.deliverPdfBlob).toHaveBeenCalledOnce());

    expect(mocks.track).toHaveBeenCalledWith("TicketDownloadStarted");
    expect(mocks.track).toHaveBeenCalledWith("TicketDownloaded");

    expect(screen.queryByRole("button", { name: "verify.download" })).toBeNull();
    expect(screen.queryByText("verify.preparing")).toBeNull();
  });

  it("downloads only once after a successful verification", async () => {
    mocks.mutationResult.data = successData;
    render(<VerifyPageClient />);

    await screen.findByText("verify.success");
    await waitFor(() => expect(mocks.deliverPdfBlob).toHaveBeenCalledOnce());
    await waitFor(() => expect(mocks.generateGuestCredentialsPdf).toHaveBeenCalledTimes(1));
  });

  it("shows a fallback download button when the mobile popup is blocked", async () => {
    mocks.mutationResult.data = successData;
    mocks.deliverPdfBlob.mockReturnValue(null);
    render(<VerifyPageClient />);

    const fallback = await screen.findByRole("button", { name: "verify.download" });

    fireEvent.click(fallback);

    await waitFor(() => expect(mocks.deliverPdfBlob).toHaveBeenCalledTimes(2));
  });

  it("shows a fallback button and tracks the failure when generation fails", async () => {
    mocks.mutationResult.data = successData;
    mocks.generateGuestCredentialsPdf.mockRejectedValueOnce(new Error("canvas broke"));
    render(<VerifyPageClient />);

    expect(await screen.findByText("verify.success")).toBeTruthy();
    expect(await screen.findByRole("button", { name: "verify.download" })).toBeTruthy();

    expect(mocks.track).toHaveBeenCalledWith("TicketDownloadFailed", {
      errorCode: "PDF_GENERATION_FAILED",
    });
  });

  it("renders the credential cards after verification", async () => {
    mocks.mutationResult.data = successData;
    mocks.deliverPdfBlob.mockReturnValue("new-tab");

    render(<VerifyPageClient />);

    expect(await screen.findByText("guest-user")).toBeTruthy();
    expect(screen.getByText("verify.credentials.username")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "verify.download" })).toBeNull();
  });
});

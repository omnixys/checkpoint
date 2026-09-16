import { ThemeProvider } from "@mui/material/styles";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createAppTheme } from "@/checkpoint/themes/createAppTheme";
import type { CallingCodeCountry } from "@/checkpoint/types/country.type";
import LoginDialog from "./LoginDialog";

const mocks = vi.hoisted(() => ({
  back: vi.fn(),
  login: vi.fn(),
  getCurrentUser: vi.fn(),
  setCurrentUser: vi.fn(),
  track: vi.fn(),
}));

const callingCodeCountries: CallingCodeCountry[] = [
  { iso2: "DE", name: "Germany", flagSvg: "/flags/de.svg", callingCode: "+49" },
];

vi.mock("next/navigation", () => ({
  useRouter: () => ({ back: mocks.back }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: ReactNode }) => <a {...props}>{children}</a>,
}));

vi.mock("@/checkpoint/components/apple/AppleButton", () => ({
  AppleButton: ({ children, ...props }: { children: ReactNode }) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@/checkpoint/components/apple/AppleCard", () => ({
  AppleCard: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/checkpoint/hooks/error", () => ({
  useFieldError: () => undefined,
  useMutationError: () => vi.fn(),
}));

vi.mock("@/checkpoint/i18n/useTypedTranslations", () => ({
  useTypedTranslations: () => (key: string) => key,
}));

vi.mock("@/checkpoint/lib/env", () => ({
  env: { CHECKPOINT_BASE_PATH: "/" },
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

afterEach(cleanup);

const renderDialog = () =>
  render(
    <ThemeProvider theme={createAppTheme("light")}>
      <LoginDialog callingCodeCountries={callingCodeCountries} />
    </ThemeProvider>,
  );

describe("LoginDialog", () => {
  it("renders the login form inside a dialog", () => {
    renderDialog();

    expect(screen.getByRole("heading", { name: "login.title" })).toBeTruthy();
    expect(screen.getByLabelText("login.username")).toBeTruthy();
    expect(screen.getByLabelText("login.password")).toBeTruthy();
    expect(screen.getByRole("button", { name: "login.submit" })).toBeTruthy();
  });

  it("closes the dialog on the close button", () => {
    renderDialog();

    screen.getByRole("button", { name: "Close sign in" }).click();
    expect(mocks.back).toHaveBeenCalledOnce();
  });

  it("routes back to the previous page after a successful sign-in", async () => {
    mocks.login.mockResolvedValueOnce(undefined);
    mocks.getCurrentUser.mockResolvedValueOnce({ id: "user-1" });
    renderDialog();

    fireEvent.change(screen.getByLabelText("login.username"), { target: { value: "ada" } });
    fireEvent.change(screen.getByLabelText("login.password"), { target: { value: "secret" } });
    fireEvent.click(screen.getByRole("button", { name: "login.submit" }));

    await waitFor(() =>
      expect(mocks.login).toHaveBeenCalledWith({ username: "ada", password: "secret" }),
    );
    expect(mocks.back).toHaveBeenCalledOnce();
  });
});

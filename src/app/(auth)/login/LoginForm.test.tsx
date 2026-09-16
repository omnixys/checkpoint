import { ThemeProvider } from "@mui/material/styles";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createAppTheme } from "@/checkpoint/themes/createAppTheme";
import type { CallingCodeCountry } from "@/checkpoint/types/country.type";
import LoginForm from "./LoginForm";

const callingCodeCountries: CallingCodeCountry[] = [
  { iso2: "DE", name: "Germany", flagSvg: "/flags/de.svg", callingCode: "+49" },
];

afterEach(cleanup);

const renderLoginForm = () =>
  render(
    <ThemeProvider theme={createAppTheme("light")}>
      <LoginForm callingCodeCountries={callingCodeCountries} />
    </ThemeProvider>,
  );

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: ReactNode }) => <a {...props}>{children}</a>,
}));

vi.mock("@/checkpoint/components/apple/AppleButton", () => ({
  AppleButton: ({ children, ...props }: { children: ReactNode }) => (
    <button {...props}>{children}</button>
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
  useAnalytics: () => ({ track: vi.fn() }),
}));

describe("LoginForm", () => {
  it("exposes password-manager autocomplete metadata", () => {
    renderLoginForm();

    expect(screen.getByLabelText("login.username")).toHaveAttribute("name", "username");
    expect(screen.getByLabelText("login.username")).toHaveAttribute("autocomplete", "username");
    expect(screen.getByLabelText("login.password")).toHaveAttribute("name", "password");
    expect(screen.getByLabelText("login.password")).toHaveAttribute(
      "autocomplete",
      "current-password",
    );
  });

  it("renders the branding panel and interactive fields", () => {
    renderLoginForm();

    expect(screen.getByRole("img", { name: "Omnixys" }).getAttribute("src")).toMatch(
      /\/logo\/omnixys/,
    );
    expect(screen.getByText("login.subtitle")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "login.title" })).toBeTruthy();
    expect(screen.getByLabelText("login.username")).toBeTruthy();
    expect(screen.getByLabelText("login.password")).toBeTruthy();
    expect(screen.getByRole("button", { name: "login.submit" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "login.back" })).toBeTruthy();
  });

  it("switches between password and guest magic-link modes", () => {
    renderLoginForm();

    fireEvent.click(screen.getByRole("button", { name: "login.guestToggle" }));

    expect(screen.queryByLabelText("login.username")).toBeNull();
    expect(screen.getByRole("button", { name: "login.guestSubmit" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "login.credentialsToggle" })).toBeTruthy();
  });

  it("defaults the guest form to the phone tab and shows country codes", () => {
    renderLoginForm();

    fireEvent.click(screen.getByRole("button", { name: "login.guestToggle" }));

    const telTab = screen.getByRole("tab", { name: "login.guestTabTel" });
    expect(telTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "login.guestTabEmail" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByLabelText("login.guestCallingCode")).toBeTruthy();
    expect(screen.getByLabelText("login.guestPhoneNumber")).toBeTruthy();
    expect(screen.queryByLabelText("login.guestEmail")).toBeNull();
  });

  it("switches the guest form to the email tab", () => {
    renderLoginForm();

    fireEvent.click(screen.getByRole("button", { name: "login.guestToggle" }));
    fireEvent.click(screen.getByRole("tab", { name: "login.guestTabEmail" }));

    expect(screen.getByRole("tab", { name: "login.guestTabEmail" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByLabelText("login.guestEmail")).toBeTruthy();
    expect(screen.queryByLabelText("login.guestPhoneNumber")).toBeNull();
  });
});

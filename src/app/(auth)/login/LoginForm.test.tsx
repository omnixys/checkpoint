import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import LoginForm from "./LoginForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
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
    render(<LoginForm />);

    expect(screen.getByLabelText("login.username")).toHaveAttribute("name", "username");
    expect(screen.getByLabelText("login.username")).toHaveAttribute("autocomplete", "username");
    expect(screen.getByLabelText("login.password")).toHaveAttribute("name", "password");
    expect(screen.getByLabelText("login.password")).toHaveAttribute(
      "autocomplete",
      "current-password",
    );
  });
});

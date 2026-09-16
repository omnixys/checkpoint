"use client";

import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useState } from "react";
import type { AppError } from "@/checkpoint/errors/app-error";
import { useFieldError, useMutationError } from "@/checkpoint/hooks/error";
import { setCurrentUser } from "@/checkpoint/lib/apollo/auth-context";
import { AuthManager } from "@/checkpoint/lib/auth/AuthManager";
import { getCurrentUser } from "@/checkpoint/lib/auth/get-current-user";
import { useAnalytics } from "@/checkpoint/providers/AnalyticsProvider";

export interface UseLoginFormOptions {
  readonly onSuccess: () => void | Promise<void>;
}

export type GuestMode = "credentials" | "guest";
export type GuestTab = "email" | "tel";

export interface LoginFormState {
  readonly mode: GuestMode;
  readonly setMode: (mode: GuestMode) => void;
  readonly username: string;
  readonly setUsername: (value: string) => void;
  readonly password: string;
  readonly setPassword: (value: string) => void;
  readonly showPassword: boolean;
  readonly toggleShowPassword: () => void;
  readonly focused: string | null;
  readonly setFocused: (value: string | null) => void;
  readonly loading: boolean;
  readonly appError: AppError | null;
  readonly usernameError: string | undefined;
  readonly passwordError: string | undefined;
  readonly submit: () => Promise<void>;
  readonly guestTab: GuestTab;
  readonly setGuestTab: (tab: GuestTab) => void;
  readonly guestEmail: string;
  readonly setGuestEmail: (value: string) => void;
  readonly guestCallingCode: string;
  readonly setGuestCallingCode: (value: string) => void;
  readonly guestPhoneNumber: string;
  readonly setGuestPhoneNumber: (value: string) => void;
  readonly guestFirstName: string;
  readonly setGuestFirstName: (value: string) => void;
  readonly guestLastName: string;
  readonly setGuestLastName: (value: string) => void;
  readonly guestLoading: boolean;
  readonly guestSent: boolean;
  readonly guestInvalid: boolean;
  readonly guestNameRequired: boolean;
  readonly guestNetworkError: boolean;
  readonly submitGuest: () => Promise<void>;
}

export function useLoginForm({ onSuccess }: UseLoginFormOptions): LoginFormState {
  const analytics = useAnalytics();
  const [mode, setMode] = useState<GuestMode>("credentials");
  const [username, setUsernameState] = useState("");
  const [password, setPasswordState] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [appError, setAppError] = useState<AppError | null>(null);
  const [guestTab, setGuestTabState] = useState<GuestTab>("tel");
  const [guestEmail, setGuestEmailState] = useState("");
  const [guestCallingCode, setGuestCallingCodeState] = useState("+49");
  const [guestPhoneNumber, setGuestPhoneNumberState] = useState("");
  const [guestFirstName, setGuestFirstNameState] = useState("");
  const [guestLastName, setGuestLastNameState] = useState("");
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestSent, setGuestSent] = useState(false);
  const [guestInvalid, setGuestInvalid] = useState(false);
  const [guestNameRequired, setGuestNameRequired] = useState(false);
  const [guestNetworkError, setGuestNetworkError] = useState(false);

  const usernameError = useFieldError(appError, "username");
  const passwordError = useFieldError(appError, "password");
  const handleMutationError = useMutationError({ operationName: "CredentialsLogin" });

  function resetGuestErrors(): void {
    setGuestInvalid(false);
    setGuestNameRequired(false);
    setGuestNetworkError(false);
  }

  function setModeAndReset(nextMode: GuestMode): void {
    setMode(nextMode);
    resetGuestErrors();
  }

  function setUsernameAndReset(value: string): void {
    setUsernameState(value);
    setAppError(null);
  }

  function setPasswordAndReset(value: string): void {
    setPasswordState(value);
    setAppError(null);
  }

  async function submit(): Promise<void> {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setAppError(null);
      analytics.track("LoginStarted");

      await AuthManager.login({ username, password });
      const user = await getCurrentUser();

      setCurrentUser(user);
      analytics.track("LoginSucceeded");

      await onSuccess();
    } catch (e) {
      analytics.track("LoginFailed", { errorCode: "AUTHENTICATION_FAILED" });
      setAppError(handleMutationError(e));
    } finally {
      setLoading(false);
    }
  }

  function submitGuestTabAndReset(tab: GuestTab): void {
    setGuestTabState(tab);
    resetGuestErrors();
  }

  function submitGuestEmailAndReset(value: string): void {
    setGuestEmailState(value);
    resetGuestErrors();
  }

  function submitGuestCallingCodeAndReset(value: string): void {
    setGuestCallingCodeState(value);
    resetGuestErrors();
  }

  function submitGuestPhoneNumberAndReset(value: string): void {
    setGuestPhoneNumberState(value);
    resetGuestErrors();
  }

  function submitGuestFirstNameAndReset(value: string): void {
    setGuestFirstNameState(value);
    setGuestNameRequired(false);
    setGuestNetworkError(false);
  }

  function submitGuestLastNameAndReset(value: string): void {
    setGuestLastNameState(value);
    setGuestNameRequired(false);
    setGuestNetworkError(false);
  }

  async function submitGuest(): Promise<void> {
    if (guestLoading) {
      return;
    }

    let identifier: string | null = null;
    if (guestTab === "email") {
      const email = guestEmail.trim().toLowerCase();
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        identifier = email;
      }
    } else {
      const callingCode = guestCallingCode.trim().replace(/^\+/, "");
      const raw = `+${callingCode}${guestPhoneNumber.trim()}`;
      const parsed = parsePhoneNumberFromString(raw);
      if (parsed?.isValid()) {
        identifier = parsed.number;
      }
    }

    if (!identifier) {
      setGuestInvalid(true);
      return;
    }

    if (guestTab === "tel" && (!guestFirstName.trim() || !guestLastName.trim())) {
      setGuestNameRequired(true);
      return;
    }

    try {
      setGuestLoading(true);
      setGuestNetworkError(false);
      await AuthManager.requestGuestMagicLink(
        identifier,
        guestFirstName.trim() || undefined,
        guestLastName.trim() || undefined,
      );
      setGuestSent(true);
    } catch {
      setGuestNetworkError(true);
      setGuestSent(false);
    } finally {
      setGuestLoading(false);
    }
  }

  return {
    mode,
    setMode: setModeAndReset,
    username,
    setUsername: setUsernameAndReset,
    password,
    setPassword: setPasswordAndReset,
    showPassword,
    toggleShowPassword: () => setShowPassword((value) => !value),
    focused,
    setFocused,
    loading,
    appError,
    usernameError,
    passwordError,
    submit,
    guestTab,
    setGuestTab: submitGuestTabAndReset,
    guestEmail,
    setGuestEmail: submitGuestEmailAndReset,
    guestCallingCode,
    setGuestCallingCode: submitGuestCallingCodeAndReset,
    guestPhoneNumber,
    setGuestPhoneNumber: submitGuestPhoneNumberAndReset,
    guestFirstName,
    setGuestFirstName: submitGuestFirstNameAndReset,
    guestLastName,
    setGuestLastName: submitGuestLastNameAndReset,
    guestLoading,
    guestSent,
    guestInvalid,
    guestNameRequired,
    guestNetworkError,
    submitGuest,
  };
}

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

export interface LoginFormState {
  readonly mode: "credentials" | "guest";
  readonly setMode: (mode: "credentials" | "guest") => void;
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
  readonly guestIdentifier: string;
  readonly setGuestIdentifier: (value: string) => void;
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

function normalizeGuestIdentifier(value: string): string | null {
  const trimmed = value.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  const phone = parsePhoneNumberFromString(trimmed);
  return phone?.isValid() ? phone.number : null;
}

function isPhoneIdentifier(value: string): boolean {
  return value.trimStart().startsWith("+");
}

/**
 * Shared credentials-login flow used by both the full login page and the
 * intercepted login dialog. After a successful sign-in the caller decides
 * where to continue via `onSuccess`.
 */
export function useLoginForm({ onSuccess }: UseLoginFormOptions): LoginFormState {
  const analytics = useAnalytics();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [appError, setAppError] = useState<AppError | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setModeState] = useState<"credentials" | "guest">("credentials");
  const [guestIdentifier, setGuestIdentifierState] = useState("");
  const [guestFirstName, setGuestFirstNameState] = useState("");
  const [guestLastName, setGuestLastNameState] = useState("");
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestSent, setGuestSent] = useState(false);
  const [guestInvalid, setGuestInvalid] = useState(false);
  const [guestNameRequired, setGuestNameRequired] = useState(false);
  const [guestNetworkError, setGuestNetworkError] = useState(false);
  const handleMutationError = useMutationError({ operationName: "CredentialsLogin" });
  const usernameError = useFieldError(appError, "username");
  const passwordError = useFieldError(appError, "password");

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

  function setMode(nextMode: "credentials" | "guest"): void {
    setModeState(nextMode);
    setGuestInvalid(false);
    setGuestNameRequired(false);
    setGuestNetworkError(false);
  }

  function setGuestIdentifier(value: string): void {
    setGuestIdentifierState(value);
    setGuestInvalid(false);
    setGuestNameRequired(false);
    setGuestNetworkError(false);
    setGuestSent(false);
  }

  function setGuestFirstName(value: string): void {
    setGuestFirstNameState(value);
    setGuestNameRequired(false);
  }

  function setGuestLastName(value: string): void {
    setGuestLastNameState(value);
    setGuestNameRequired(false);
  }

  async function submitGuest(): Promise<void> {
    if (guestLoading) {
      return;
    }

    const identifier = normalizeGuestIdentifier(guestIdentifier);
    if (!identifier) {
      setGuestInvalid(true);
      return;
    }

    if (isPhoneIdentifier(guestIdentifier) && (!guestFirstName.trim() || !guestLastName.trim())) {
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
    setMode,
    username,
    setUsername,
    password,
    setPassword,
    showPassword: showPw,
    toggleShowPassword: () => setShowPw((p) => !p),
    focused,
    setFocused,
    loading,
    appError,
    usernameError,
    passwordError,
    submit,
    guestIdentifier,
    setGuestIdentifier,
    guestFirstName,
    setGuestFirstName,
    guestLastName,
    setGuestLastName,
    guestLoading,
    guestSent,
    guestInvalid,
    guestNameRequired,
    guestNetworkError,
    submitGuest,
  };
}

"use client";

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

  return {
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
  };
}

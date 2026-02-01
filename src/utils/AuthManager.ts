"use client";
import { ApolloClient } from "@apollo/client";
import {
  LOGIN,
  LOGOUT,
  REFRESH,
  USER_SIGN_UP,
} from "@/graphql/authentication/auth.mutation";
import {
  LoginRequest,
  LoginResult,
  RefreshResult,
  UserSignUpRequest,
  UserSignUpResult,
} from "@/types/authentication/auth-graphql.type";
import {
  LoginInput,
  UserSignUpInput,
} from "@/types/authentication/auth-input.type";

/* --------------------------------------------------------------
 * Browser Cookie Helper
 * -------------------------------------------------------------- */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function removeCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

/* --------------------------------------------------------------
 * Auth Event Bus
 * -------------------------------------------------------------- */
class AuthEventEmitter {
  private listeners = new Map<string, Array<(p?: any) => void>>();

  on(name: string, fn: (p?: any) => void) {
    if (!this.listeners.has(name)) this.listeners.set(name, []);
    this.listeners.get(name)!.push(fn);
  }

  emit(name: string, payload?: any) {
    this.listeners.get(name)?.forEach((fn) => fn(payload));
  }
}

export const AuthEventsBus = new AuthEventEmitter();

/* --------------------------------------------------------------
 * Auth Manager (Variant B)
 * -------------------------------------------------------------- */
class AuthManagerClass {
  private intervalId: number | null = null;
  private apollo: ApolloClient | null = null;
  private isRefreshing = false;

  init(apollo: ApolloClient) {
    this.apollo = apollo;

    // Start lightweight ticker
    if (!this.intervalId) {
      this.intervalId = window.setInterval(() => {
        this.checkRefresh();
      }, 5_000); // alle 5s prüfen (unproblematisch)
    }
  }

  /* --------------------------------------------------------------
   * Core Refresh Check (QR-Counter-Pattern)
   * -------------------------------------------------------------- */
  private async checkRefresh() {
    if (this.isRefreshing) return;

    const expRaw = getCookie("access_expires_at");
    if (!expRaw) return;

    const expiresAt = Number(expRaw);
    const remainingMs = expiresAt - Date.now();

    if (remainingMs <= 30_000) {
      this.isRefreshing = true;
      try {
        await this.forceRefresh();
      } finally {
        this.isRefreshing = false;
        return remainingMs;
      }
    }
  }

  /* --------------------------------------------------------------
   * LOGIN
   * -------------------------------------------------------------- */
  async login(input: LoginInput): Promise<void> {
    if (!this.apollo) throw new Error("Auth not initialized");

    const res = await this.apollo.mutate<LoginResult, LoginRequest>({
      mutation: LOGIN,
      variables: { input },
      fetchPolicy: "no-cache",
    });

    if (!res.data?.login) throw new Error("Missing login payload");
    AuthEventsBus.emit("login");
  }

  /* --------------------------------------------------------------
   * REFRESH
   * -------------------------------------------------------------- */
  async forceRefresh(): Promise<void> {
    const res = await this.apollo!.mutate<RefreshResult>({
      mutation: REFRESH,
      fetchPolicy: "no-cache",
    });

    if (!res.data?.refresh) throw new Error("Missing refresh payload");
    AuthEventsBus.emit("refresh");
  }

  /* --------------------------------------------------------------
   * SIGNUP
   * -------------------------------------------------------------- */
  async signup(input: UserSignUpInput): Promise<void> {
    if (!this.apollo) throw new Error("Auth not initialized");

    const res = await this.apollo.mutate<UserSignUpResult, UserSignUpRequest>({
      mutation: USER_SIGN_UP,
      variables: { input },
    });

    AuthEventsBus.emit("signup");
  }

  /* --------------------------------------------------------------
   * LOGOUT
   * -------------------------------------------------------------- */
  async logout(): Promise<void> {
    if (!this.apollo) throw new Error("Auth not initialized");

    await this.apollo.mutate({
      mutation: LOGOUT,
      fetchPolicy: "no-cache",
    });

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    AuthEventsBus.emit("logout");
  }
}

export const AuthManager = new AuthManagerClass();

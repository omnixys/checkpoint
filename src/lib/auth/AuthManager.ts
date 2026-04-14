"use client";

import {
  LoginMutation,
  LoginMutationVariables,
  LoginDocument,
  RefreshMutation,
  RefreshMutationVariables,
  RefreshDocument,
  LogoutMutation,
  LogoutMutationVariables,
  LogoutDocument,
} from "@/checkpoint/generated/graphql";
import { getCookie } from "@/checkpoint/lib/apollo/cookie.utils";
/**
 * AuthManager
 *
 * Responsibilities:
 * - Manage authentication lifecycle
 * - Handle token refresh
 * - Emit correct domain events
 *
 * IMPORTANT:
 * - Token refresh MUST NOT trigger user refetch
 * - Events are strictly separated by domain:
 *   - session:* → transport layer
 *   - auth:* → identity layer
 *   - user:* → domain data
 */

import type { ApolloClient } from "@apollo/client";

/**
 * Typed Event Bus
 */
type AuthEvent =
  | "auth:login"
  | "auth:logout"
  | "auth:signup"
  | "session:refreshed"
  | "user:changed";

class AuthEventEmitter {
  private listeners = new Map<AuthEvent, Array<(p?: any) => void>>();

  on(name: AuthEvent, fn: (p?: any) => void) {
    if (!this.listeners.has(name)) this.listeners.set(name, []);
    this.listeners.get(name)?.push(fn);
  }

  off(name: AuthEvent, fn: (p?: any) => void) {
    const list = this.listeners.get(name);
    if (!list) return;

    this.listeners.set(
      name,
      list.filter((l) => l !== fn),
    );
  }

  emit(name: AuthEvent, payload?: any) {
    this.listeners.get(name)?.forEach((fn) => fn(payload));
  }
}

export const AuthEventsBus = new AuthEventEmitter();

/**
 * AuthManager implementation
 */
class AuthManagerClass {
  private intervalId: number | null = null;
  private apollo: ApolloClient | null = null;
  private isRefreshing = false;

  /**
   * Initialize manager
   */
  init(apollo?: ApolloClient) {
    if (apollo) {
      this.apollo = apollo;
    }

    if (!this.intervalId) {
      this.intervalId = window.setInterval(() => {
        this.checkRefresh();
      }, 5000);
    }
  }

  /**
   * Periodic refresh check
   *
   * WHY:
   * - Ensures tokens are refreshed before expiration
   * - Prevents race conditions in API calls
   */
  private async checkRefresh() {
    if (this.isRefreshing) return;

    const expRaw = getCookie("access_expires_at");
    if (!expRaw) return;

    const expiresAt = Number(expRaw);
    const remainingMs = expiresAt - Date.now();

    /**
     * Only refresh when close to expiry
     * Prevent unnecessary refresh spam
     */
    if (remainingMs <= 30_000 && remainingMs > 0) {
      this.isRefreshing = true;

      try {
        await this.forceRefresh();
      } finally {
        this.isRefreshing = false;
      }
    }
  }

  /**
   * Login
   */
  async login(input: { username: string; password: string }): Promise<void> {
    this.assertApollo();

    const res = await this.apollo!.mutate<LoginMutation, LoginMutationVariables>({
      mutation: LoginDocument,
      variables: { input },
      fetchPolicy: "no-cache",
      context: { fetchOptions: { credentials: "include" } },
    });

    if (!res?.data?.credentialsLogin) {
      throw new Error("Login failed: missing payload");
    }

    /**
     * Emit identity event
     */
    AuthEventsBus.emit("auth:login");
  }

  /**
   * Force token refresh
   *
   * IMPORTANT:
   * - Only emits session event
   * - MUST NOT trigger "me" refetch
   */
  async forceRefresh(): Promise<void> {
    this.assertApollo();

    const res = await this.apollo!.mutate<RefreshMutation, RefreshMutationVariables>({
      mutation: RefreshDocument,
      fetchPolicy: "no-cache",
      context: { fetchOptions: { credentials: "include" } },
    });

    if (!res?.data?.refresh) {
      throw new Error("Refresh failed: missing payload");
    }

    /**
     * Session-level event only
     */
    AuthEventsBus.emit("session:refreshed");
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    this.assertApollo();

    await this.apollo!.mutate<LogoutMutation, LogoutMutationVariables>({
      mutation: LogoutDocument,
      fetchPolicy: "no-cache",
      context: { fetchOptions: { credentials: "include" } },
    });

    /**
     * Stop refresh loop
     */
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    /**
     * Emit identity event
     */
    AuthEventsBus.emit("auth:logout");
  }

  /**
   * Ensure Apollo is initialized
   */
  private assertApollo() {
    if (!this.apollo) {
      throw new Error("AuthManager not initialized with ApolloClient");
    }
  }
}

export const AuthManager = new AuthManagerClass();

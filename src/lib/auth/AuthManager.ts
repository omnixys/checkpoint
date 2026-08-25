"use client";

import {
  LoginDocument,
  type LoginMutation,
  type LoginMutationVariables,
  LogoutDocument,
  type LogoutMutation,
  type LogoutMutationVariables,
  RefreshDocument,
  type RefreshMutation,
  type RefreshMutationVariables,
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
import { AppError, ErrorCode, normalizeApolloError } from "@/checkpoint/errors/app-error";
import { env } from "@/checkpoint/lib/env";
import { getLogger } from "@/checkpoint/utils/logger";

const logger = getLogger("AuthManager");

/**
 * Auth failure codes that cannot be recovered by retrying the refresh.
 */
const DEFINITIVE_AUTH_CODES = new Set<ErrorCode>([
  ErrorCode.UNAUTHORIZED,
  ErrorCode.SESSION_EXPIRED,
  ErrorCode.REFRESH_TOKEN_EXPIRED,
  ErrorCode.FORBIDDEN,
  ErrorCode.UNAUTHORIZED_TENANT,
  ErrorCode.TENANT_MEMBERSHIP_NOT_FOUND,
]);

export function isDefinitiveAuthFailure(error: AppError): boolean {
  return DEFINITIVE_AUTH_CODES.has(error.code) || error.status === 401 || error.status === 403;
}

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
  private readonly listeners = new Map<AuthEvent, Array<(payload?: unknown) => void>>();

  on(name: AuthEvent, fn: (payload?: unknown) => void) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, []);
    }
    this.listeners.get(name)?.push(fn);
  }

  off(name: AuthEvent, fn: (payload?: unknown) => void) {
    const list = this.listeners.get(name);
    if (!list) {
      return;
    }

    this.listeners.set(
      name,
      list.filter((l) => l !== fn),
    );
  }

  emit(name: AuthEvent, payload?: unknown) {
    this.listeners.get(name)?.forEach((fn) => {
      try {
        const result = fn(payload) as unknown;
        /**
         * Listener failures must never break the emitting code path.
         * Apollo errors are already captured by the app error link.
         */
        void Promise.resolve(result).catch((error) => {
          logger.warn(`Auth event listener rejected (${name})`, {
            message: error instanceof Error ? error.message : String(error),
          });
        });
      } catch (error) {
        logger.warn(`Auth event listener failed (${name})`, {
          message: error instanceof Error ? error.message : String(error),
        });
      }
    });
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
    if (this.isRefreshing) {
      return;
    }

    const expRaw = getCookie("access_expires_at");
    if (!expRaw) {
      return;
    }

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
      } catch (error) {
        await this.handleRecoveryFailure(error);
      } finally {
        this.isRefreshing = false;
      }
    }
  }

  /**
   * Handle a failed periodic refresh.
   *
   * Definitive auth failures (expired session, revoked membership, ...)
   * cannot recover by retrying: sign out and return to the login page.
   * Transient failures are logged and retried on the next tick.
   */
  private async handleRecoveryFailure(error: unknown): Promise<void> {
    const appError = normalizeApolloError(error, { operationName: "Refresh" });

    if (!isDefinitiveAuthFailure(appError)) {
      logger.warn("Token refresh failed; retrying on next tick", appError.toLogContext());
      return;
    }

    logger.error("Session is unrecoverable; signing out", appError.toLogContext());

    try {
      await this.logout();
    } catch (logoutError) {
      const logoutAppError = normalizeApolloError(logoutError, { operationName: "Logout" });
      logger.warn("Logout during session recovery failed", logoutAppError.toLogContext());
    } finally {
      this.redirectToLogin();
    }
  }

  private redirectToLogin(): void {
    if (typeof window === "undefined") {
      return;
    }
    window.location.assign(`${env.CHECKPOINT_BASE_PATH}login`);
  }

  /**
   * Login
   */
  async login(input: { username: string; password: string }): Promise<void> {
    this.assertApollo();

    const res = await this.apollo?.mutate<LoginMutation, LoginMutationVariables>({
      mutation: LoginDocument,
      variables: { input },
      fetchPolicy: "no-cache",
      context: { fetchOptions: { credentials: "include" } },
    });

    if (!res?.data?.credentialsLogin) {
      throw new AppError({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Login response was incomplete",
        operationName: "CredentialsLogin",
      });
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

    const res = await this.apollo?.mutate<RefreshMutation, RefreshMutationVariables>({
      mutation: RefreshDocument,
      fetchPolicy: "no-cache",
      context: { fetchOptions: { credentials: "include" } },
    });

    if (!res?.data?.refresh) {
      throw new AppError({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Refresh response was incomplete",
        operationName: "Refresh",
      });
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

    await this.apollo?.mutate<LogoutMutation, LogoutMutationVariables>({
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
      throw new AppError({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Authentication client is not initialized",
      });
    }
  }
}

export const AuthManager = new AuthManagerClass();

"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useApolloClient } from "@apollo/client/react";
import { UserPayload } from "@/checkpoint/generated/graphql";
import { useMe } from "@/checkpoint/hooks/user/useMe";
import { setCurrentUser } from "@/checkpoint/lib/apollo/auth-context";
import { AuthManager, AuthEventsBus } from "@/checkpoint/lib/auth/AuthManager";
import { CurrentUser } from "@/checkpoint/lib/auth/auth.types";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Auth context value exposed to the application.
 *
 * This is the single source of truth for:
 * - authenticated user
 * - auth state
 * - auth actions
 */
interface AuthContextValue {
  user?: UserPayload | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * AuthProvider
 *
 * Responsibilities:
 * - Initializes AuthManager with global Apollo Client
 * - Keeps user state in sync with backend (via useMe)
 * - Propagates user into Apollo header layer (actorId)
 * - Handles auth lifecycle events (login/logout/user changes)
 *
 * Important:
 * This provider ensures that EVERY GraphQL request contains:
 * - x-tenant-id
 * - x-actor-id
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const client = useApolloClient();

  /**
   * Fetch authenticated user
   *
   * fetchPolicy:
   * - cache-first prevents duplicate requests
   * - still allows refetch on login/logout
   */
  const { user, loading, refetch } = useMe();

  /**
   * Derived authentication state
   */
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  /* ------------------------------------------------------------------------ */
  /* Initialize AuthManager                                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    /**
     * AuthManager needs Apollo client for:
     * - login mutations
     * - logout mutations
     */
    AuthManager.init(client);
  }, [client]);

  /* ------------------------------------------------------------------------ */
  /* Sync authentication state                                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    setIsAuthenticated(Boolean(user));
  }, [user]);

  /* ------------------------------------------------------------------------ */
  /* CRITICAL: Sync user to Apollo header layer                               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!user) return;

    const currentUser: CurrentUser = {
      id: user.id,
      username: user.username,
      email: user.personalInfo?.email,
      role: user.role ?? undefined
    };
    
    /**
     * This is REQUIRED for:
     * - x-actor-id header
     * - Kafka context propagation
     * - audit logging
     */
    setCurrentUser(currentUser ?? null);
  }, [user]);

  /* ------------------------------------------------------------------------ */
  /* Auth event handling                                                      */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    /**
     * On login:
     * - refetch user from backend
     * - ensures fresh user data
     */
    const handleLogin = async (): Promise<void> => {
      await refetch();
    };

    /**
     * On logout:
     * - reset local state
     */
    const handleLogout = (): void => {
      setIsAuthenticated(false);
      setCurrentUser(null);
    };

    /**
     * On user change:
     * - refresh user data (e.g. profile update)
     */
    const handleUserChanged = async (): Promise<void> => {
      await refetch();
    };

    AuthEventsBus.on("auth:login", handleLogin);
    AuthEventsBus.on("auth:logout", handleLogout);
    AuthEventsBus.on("user:changed", handleUserChanged);

    return () => {
      AuthEventsBus.off("auth:login", handleLogin);
      AuthEventsBus.off("auth:logout", handleLogout);
      AuthEventsBus.off("user:changed", handleUserChanged);
    };
  }, [refetch]);

  /* ------------------------------------------------------------------------ */
  /* Actions                                                                  */
  /* ------------------------------------------------------------------------ */

  /**
   * Logout action
   *
   * Responsibilities:
   * - Invalidate backend session
   * - Clear Apollo cache
   * - Reset user context
   */
  const logout = async (): Promise<void> => {
    await AuthManager.logout();

    /**
     * Reset header context immediately
     */
    setCurrentUser(null);

    /**
     * Clear Apollo cache to avoid stale data
     */
    await client.clearStore();
  };

  /* ------------------------------------------------------------------------ */
  /* Context Value                                                            */
  /* ------------------------------------------------------------------------ */

const value = useMemo<AuthContextValue>(
  () => ({
    ...(user !== undefined ? { user } : {}),
    isAuthenticated,
    loading,
    logout,
  }),
  [user, isAuthenticated, loading],
);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* -------------------------------------------------------------------------- */
/* Hook                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * useAuth
 *
 * Provides access to authentication state and actions.
 *
 * Throws if used outside AuthProvider to prevent silent bugs.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}

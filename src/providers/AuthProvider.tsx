"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useApolloClient } from "@apollo/client/react";
import { CurrentUserQuery, UserPayload } from "@/checkpoint/generated/graphql";
import { setCurrentUser } from "@/checkpoint/lib/apollo/auth-context";
import { AuthManager, AuthEventsBus } from "@/checkpoint/lib/auth/AuthManager";
import { CurrentUser } from "@/checkpoint/lib/auth/auth.types";
import useMeQuery from "@/checkpoint/hooks/user/useMeQuery";

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
  currentUser?: CurrentUserQuery['me'];
  isAuthenticated: boolean;
  currentUserLoading: boolean;
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
const [authUser, setAuthUser] = useState<
  CurrentUserQuery["me"] | null | undefined
>(undefined);
  
  /**
   * Fetch authenticated user
   *
   * fetchPolicy:
   * - cache-first prevents duplicate requests
   * - still allows refetch on login/logout
   */
  const { currentUser, currentUserLoading, currentUserRefetch } = useMeQuery({loadCurrentUser: true});


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
  /* CRITICAL: Sync user to Apollo header layer                               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!currentUser) return;
    
    /**
     * This is REQUIRED for:
     * - x-actor-id header
     * - Kafka context propagation
     * - audit logging
     */
    setCurrentUser(currentUser);
    setAuthUser(currentUser ?? null);
  }, [currentUser]);

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
      await currentUserRefetch();
    };

    /**
     * On logout:
     * - reset local state
     */
    const handleLogout = (): void => {
      setCurrentUser(null);
    };

    /**
     * On user change:
     * - refresh user data (e.g. profile update)
     */
    const handleUserChanged = async (): Promise<void> => {
      await currentUserRefetch();
    };

    AuthEventsBus.on("auth:login", handleLogin);
    AuthEventsBus.on("auth:logout", handleLogout);
    AuthEventsBus.on("user:changed", handleUserChanged);

    return () => {
      AuthEventsBus.off("auth:login", handleLogin);
      AuthEventsBus.off("auth:logout", handleLogout);
      AuthEventsBus.off("user:changed", handleUserChanged);
    };
  }, [currentUserRefetch]);

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
      setAuthUser(null);

    /**
     * Clear Apollo cache to avoid stale data
     */
    await client.clearStore();
  };

  /* ------------------------------------------------------------------------ */
  /* Context Value                                                            */
  /* ------------------------------------------------------------------------ */

const value = {
  ...(currentUser !== undefined ? { currentUser } : {}),
  isAuthenticated: !!authUser,
  currentUserLoading,
  logout,
};

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

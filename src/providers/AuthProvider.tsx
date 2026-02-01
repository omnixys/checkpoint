// /providers/AuthProvider.tsx
"use client";

import { ApolloProvider, useQuery } from "@apollo/client/react";
import React, {
  createContext,
  JSX,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { ME } from "@/graphql/user/user-query.graphql";
import { createCombinedApolloClient } from "@/lib/client/combined-client";
import { EventRole } from "@/types/event/event-enum.type";
import type { MeResult } from "@/types/user/user-graphql.type";
import { User } from "@/types/user/user.type";
import { AuthEventsBus, AuthManager } from "@/utils/AuthManager";

export interface AuthContextType {
  user?: User;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  refetchMe: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const client = useMemo(() => createCombinedApolloClient(), []);
  const { data, loading, refetch } = useQuery<MeResult>(ME, {
    client,
    fetchPolicy: "cache-and-network",
    context: { fetchOptions: { credentials: "include" } },
  });

  const user = data?.me;
  const isAdmin = user?.roles?.includes(EventRole.ADMIN) ?? false;
  const isAuthenticated = !!user;

  /* Initialize AuthManager */
  useEffect(() => {
    AuthManager.init(client);
  }, [client]);

  /* Re-fetch user on events */
  useEffect(() => {
    const refetchUser = (): void => {
      void refetch();
    };

    AuthEventsBus.on("login", refetchUser);
    AuthEventsBus.on("refresh", refetchUser);
    AuthEventsBus.on("signup", refetchUser);
    AuthEventsBus.on("logout", refetchUser);

    return () => {};
  }, [refetch]);

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider
        value={{
          user,
          isAdmin,
          isAuthenticated,
          loading,
          logout: () => AuthManager.logout(),
          refetchMe: () => refetch(),
        }}
      >
        {children}
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

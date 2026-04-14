"use client";

import { createApolloClient } from "@/checkpoint/lib/apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import type React from "react";

/**
 * Apollo Client singleton (browser only)
 *
 * WHY:
 * - Prevents cache reset on re-render
 * - Ensures stable reference for AuthManager
 * - Required for consistent GraphQL behavior
 */
let apolloClient: ReturnType<typeof createApolloClient> | null = null;

function getApolloClient() {
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }
  return apolloClient;
}

/**
 * Root Apollo Provider
 */
export function ApolloRootProvider({ children }: { children: React.ReactNode }) {
  const client = getApolloClient();

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

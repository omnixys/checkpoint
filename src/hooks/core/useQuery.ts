"use client";

import { useEffect } from "react";
import { useQuery as useApolloQuery, type QueryHookOptions } from "@apollo/client/react";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

/**
 * Apollo v4-safe query hook
 *
 * IMPORTANT:
 * - DO NOT manually type TData / TVariables
 * - Let TypedDocumentNode infer everything
 */
export function useQuery<TData = any, TVariables = any>(
  document: TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<any, any>, // ← intentionally loosened
) {
  const result = useApolloQuery(document, {
    ...options,
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });

  return result;
}

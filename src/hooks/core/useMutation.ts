"use client";

import { useMutation as useApolloMutation } from "@apollo/client/react";
import type { OperationVariables } from "@apollo/client";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

export function useMutation<TData, TVariables extends OperationVariables = OperationVariables>(
  document: TypedDocumentNode<TData, TVariables>,
) {
  return useApolloMutation<TData, TVariables>(document, {
    errorPolicy: "all",
  });
}

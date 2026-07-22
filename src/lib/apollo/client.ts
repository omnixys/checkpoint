import { ApolloClient, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import type { DefinitionNode, OperationDefinitionNode } from "graphql";
import { getAccessTokenClient } from "@/checkpoint/lib/apollo/cookie.utils";
import { apolloCache } from "./cache";
import { createHttpLinkWithMiddleware } from "./http-link";
import { createWsLinkWithAuth } from "./ws-link";

/**
 * Detect subscription operations
 */
function isSubscription(def: DefinitionNode | null): def is OperationDefinitionNode {
  return !!def && def.kind === "OperationDefinition" && def.operation === "subscription";
}

/**
 * Apollo Client factory
 */
export function createApolloClient(): ApolloClient {
  const httpLink = createHttpLinkWithMiddleware(getAccessTokenClient);
  const wsLink = createWsLinkWithAuth();

  const link =
    typeof window !== "undefined" && wsLink
      ? split(({ query }) => isSubscription(getMainDefinition(query)), wsLink, httpLink)
      : httpLink;

  return new ApolloClient({
    link,
    cache: apolloCache,
  });
}

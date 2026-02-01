import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import type { DefinitionNode, OperationDefinitionNode } from "graphql";

import { createHttpApolloClient } from "./http-client";
import { createWsApolloClient } from "./ws-client";

// Replacement for ApolloLink.never()
const neverLink = new ApolloLink(() => {
  return {
    subscribe() {
      return {
        unsubscribe() {},
      };
    },
  } as any;
});

function isSubscription(
  def: DefinitionNode | null
): def is OperationDefinitionNode {
  return (
    !!def &&
    def.kind === "OperationDefinition" &&
    def.operation === "subscription"
  );
}

function hasFile(value: any): boolean {
  if (!value) return false;

  if (value instanceof File) return true;

  if (Array.isArray(value)) {
    return value.some((v) => hasFile(v));
  }

  if (typeof value === "object") {
    return Object.values(value).some((v) => hasFile(v));
  }

  return false;
}

export function createCombinedApolloClient(token?: string): ApolloClient {
  const httpClient = createHttpApolloClient(token);
  const wsClient = createWsApolloClient(token);

  const httpLink = httpClient.link;
  const wsLink = wsClient?.link ?? neverLink;

  const splitLink = ApolloLink.split(
    ({ query }) => isSubscription(getMainDefinition(query)),
    wsLink, // only subscriptions
    httpLink // everything else
  );

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink,
  });
}



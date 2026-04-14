import { useQuery } from "@apollo/client/react";
import { ErrorLike } from "@apollo/client";
import { UserPayload, MeQuery, MeQueryVariables, MeDocument } from "@/checkpoint/generated/graphql";

export interface UseMePayload {
  user?: UserPayload | undefined;
  loading: boolean;
  error?: ErrorLike | undefined;
  refetch: () => Promise<void>;
}

export function useMe(): UseMePayload {
  const { data, loading, error, refetch } = useQuery<MeQuery, MeQueryVariables>(MeDocument, {
    fetchPolicy: "cache-first",
  });

  const user = data?.me;

  return {
    user,
    loading,
    error,
    refetch: async () => {
      await refetch();
    },
  };
}

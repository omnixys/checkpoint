import {
  MyEventsDocument,
  MyEventsQuery,
  MyEventsQueryVariables,
} from "@/checkpoint/generated/graphql";
import { ErrorLike } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export interface UseEventsQueryPayload {
  events?: any[];
  loading: boolean;
  error?: ErrorLike | undefined;
  refetch: () => Promise<void>;
}

export function useEventsQuery(): UseEventsQueryPayload {
  const { data, loading, error, refetch } = useQuery<
    MyEventsQuery,
    MyEventsQueryVariables
  >(MyEventsDocument, {
    fetchPolicy: "cache-first",
  });

  const events = data?.myEvents ?? [];

  return {
    events,
    loading,
    error,
    refetch: async () => {
      await refetch();
    },
  };
}

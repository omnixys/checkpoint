import { useQuery } from "@apollo/client/react";
import { ErrorLike } from "@apollo/client";
import {
  EventPayload,
  MyEventsQuery,
  MyEventsQueryVariables,
  MyEventsDocument,
} from "@/checkpoint/generated/graphql";

export interface UseEventsQueryPayload {
  events?: EventPayload[];
  loading: boolean;
  error?: ErrorLike | undefined;
  refetch: () => Promise<void>;
}

export function useEventsQuery(): UseEventsQueryPayload {
  const { data, loading, error, refetch } = useQuery<MyEventsQuery, MyEventsQueryVariables>(
    MyEventsDocument,
    {
      fetchPolicy: "cache-first",
    },
  );

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

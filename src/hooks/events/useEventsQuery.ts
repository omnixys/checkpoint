import {
  MyEventsDocument,
  MyEventsQuery,
  MyEventsQueryVariables,
} from "@/checkpoint/generated/graphql";
import { ErrorLike } from "@apollo/client";
import { useQuery } from "@apollo/client/react";


export function useEventsQuery() {
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

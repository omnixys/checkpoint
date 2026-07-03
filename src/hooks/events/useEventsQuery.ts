import { useQuery } from "@apollo/client/react";
import {
  MyEventsDocument,
  type MyEventsQuery,
  type MyEventsQueryVariables,
} from "@/checkpoint/generated/graphql";

export function useEventsQuery() {
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

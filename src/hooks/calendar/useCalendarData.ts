import {
  MyEventsQuery,
  MyEventsQueryVariables,
  MyEventsDocument,
} from "@/checkpoint/generated/graphql";
import { useQuery } from "@apollo/client/react";

/**
 * Handles all data fetching logic.
 * Keeps UI completely clean from API concerns.
 */
export function useCalendarData() {
  const query = useQuery<MyEventsQuery, MyEventsQueryVariables>(MyEventsDocument, {
    fetchPolicy: "cache-and-network",
  });

  return {
    events: query.data?.myEvents ?? [],
    loading: query.loading,
    error: query.error,
  };
}

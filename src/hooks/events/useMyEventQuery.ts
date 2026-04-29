import {
  EventPageDocument,
  EventPageQuery,
  EventPageQueryVariables,
  GetEventMetaDocument,
  GetEventMetaQuery,
  GetEventMetaQueryVariables,
  GetMyEventCalendarDataDocument,
  GetMyEventCalendarDataQuery,
  GetMyEventCalendarDataQueryVariables,
} from "@/checkpoint/generated/graphql";
import { useQuery } from "@apollo/client/react";

interface Props {
  isAuthenticated?: boolean | undefined;

  loadMyEventCalendarData?: boolean | undefined;
}

export default function useMyEventQuery({ loadMyEventCalendarData = false }: Props) {
  const myEventCalendarDataQueryResult = useQuery<
    GetMyEventCalendarDataQuery,
    GetMyEventCalendarDataQueryVariables
  >(GetMyEventCalendarDataDocument, {
    fetchPolicy: "cache-and-network",
    skip: !loadMyEventCalendarData,
  });

  const myEventCalendarData = myEventCalendarDataQueryResult.data?.myEvents;

  return {
    myEventCalendarData,
    myEventCalendarDataLoading: myEventCalendarDataQueryResult.loading,
    myEventCalendarDataError: myEventCalendarDataQueryResult.error,
    myEventCalendarDataRefetch: myEventCalendarDataQueryResult.refetch,
  };
}

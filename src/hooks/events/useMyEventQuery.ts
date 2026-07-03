import { useQuery } from "@apollo/client/react";
import {
  GetMyEventCalendarDataDocument,
  type GetMyEventCalendarDataQuery,
  type GetMyEventCalendarDataQueryVariables,
} from "@/checkpoint/generated/graphql";

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

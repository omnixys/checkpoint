import { useLazyQuery, useQuery } from "@apollo/client/react";
import {
  SeatListDocument,
  type SeatListQuery,
  type SeatListQueryVariables,
} from "@/checkpoint/generated/graphql";

interface Props {
  eventId?: string | undefined;
  loadSeatList?: boolean | undefined;
}

export default function useSeatListQuery({ eventId, loadSeatList }: Props) {
  const getSeatLisQueryResult = useQuery<SeatListQuery, SeatListQueryVariables>(SeatListDocument, {
    variables: { eventId: eventId ?? "" },
    fetchPolicy: "cache-and-network",
    skip: !eventId || !loadSeatList,
  });

  const seatList = getSeatLisQueryResult.data?.seats;

  const [getSeatList] = useLazyQuery<SeatListQuery, SeatListQueryVariables>(SeatListDocument, {
    fetchPolicy: "cache-and-network",
  });

  return {
    getSeatList,

    seatList,
    seatListLoading: getSeatLisQueryResult.loading,
    seatListError: getSeatLisQueryResult.error,
    seatListRefetch: getSeatLisQueryResult.refetch,
  };
}

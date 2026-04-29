import {
  SeatListDocument,
  SeatListQuery,
  SeatListQueryVariables,
} from "@/checkpoint/generated/graphql";
import { useLazyQuery, useQuery } from "@apollo/client/react";

interface Props {
  eventId?: string | undefined;
  loadSeatList?: boolean | undefined;
}

export default function useSeatListQuery({ eventId, loadSeatList }: Props) {
  const getSeatLisQueryResult = useQuery<SeatListQuery, SeatListQueryVariables>(SeatListDocument, {
    variables: { id: eventId ?? "" },
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

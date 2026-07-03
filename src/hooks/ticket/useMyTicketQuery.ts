import { useQuery } from "@apollo/client/react";
import {
  GetMyFullTicketListDocument,
  type GetMyFullTicketListQuery,
  type GetMyFullTicketListQueryVariables,
  GetMyTicketListDocument,
  type GetMyTicketListQuery,
  type GetMyTicketListQueryVariables,
} from "@/checkpoint/generated/graphql";

interface Props {
  eventId?: string | undefined;
  loadMyTicketList?: boolean | undefined;
  loadMyFullTicketList?: boolean | undefined;
}

export default function useMyTicketQuery({
  eventId,
  loadMyTicketList = false,
  loadMyFullTicketList = false,
}: Props) {
  const myTicketListQueryResult = useQuery<GetMyTicketListQuery, GetMyTicketListQueryVariables>(
    GetMyTicketListDocument,
    {
      fetchPolicy: "cache-and-network",
      skip: !eventId || !loadMyTicketList,
    },
  );

  const myTicketList = myTicketListQueryResult.data?.getMyTickets;
  const ticketEventIdMap = new Map(
    myTicketList?.map((myTicket) => [myTicket.eventId, myTicket]) ?? [],
  );

  const myFullTicketListQueryResult = useQuery<
    GetMyFullTicketListQuery,
    GetMyFullTicketListQueryVariables
  >(GetMyFullTicketListDocument, {
    fetchPolicy: "cache-and-network",
    skip: !eventId || !loadMyFullTicketList,
  });

  const myFullTicketList = myFullTicketListQueryResult.data?.getMyTickets;
  const fullTicketEventIdMap = new Map(
    myFullTicketList?.map((myTicket) => [myTicket.eventId, myTicket]) ?? [],
  );

  return {
    myTicketList,
    ticketEventIdMap,
    myTicketListLoading: myTicketListQueryResult.loading,
    myTicketListError: myTicketListQueryResult.error,
    myTicketListRefetch: myTicketListQueryResult.refetch,

    myFullTicketList,
    fullTicketEventIdMap,
    myFullTicketListLoading: myFullTicketListQueryResult.loading,
    myFullTicketListError: myFullTicketListQueryResult.error,
    myFullTicketListRefetch: myFullTicketListQueryResult.refetch,
  };
}

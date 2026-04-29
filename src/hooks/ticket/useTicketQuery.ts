import {
  EventPageDocument,
  EventPageQuery,
  EventPageQueryVariables,
  SecurityTicketPageDocument,
  SecurityTicketPageQuery,
  SecurityTicketPageQueryVariables,
  TicketPageDocument,
  TicketPageQuery,
  TicketPageQueryVariables,
} from "@/checkpoint/generated/graphql";
import { useQuery } from "@apollo/client/react";

interface Props {
  eventId: string;
  loadTicketPage?: boolean | undefined;
  loadSecurityTicketPage?: boolean | undefined;
}

export default function useTicketQuery({
  eventId,
  loadTicketPage = false,
  loadSecurityTicketPage = false,
}: Props) {
  const ticketPageQueryResult = useQuery<TicketPageQuery, TicketPageQueryVariables>(
    TicketPageDocument,
    {
      variables: { eventId },
      fetchPolicy: "cache-and-network",
      skip: !loadTicketPage || !eventId,
    },
  );

  const ticketPage = ticketPageQueryResult.data?.ticketsByEvent;

  const getTicketListQueryResult = useQuery<
    SecurityTicketPageQuery,
    SecurityTicketPageQueryVariables
  >(SecurityTicketPageDocument, {
    variables: { eventId },
    fetchPolicy: "cache-and-network",
    skip: !loadSecurityTicketPage || !eventId,
  });

  const securityTicketList =
    getTicketListQueryResult?.data?.ticketsByEvent.filter((t) => !t.revoked) ?? [];

  const securityTicketMap = new Map(securityTicketList?.map((ticket) => [ticket.id, ticket]));

  return {
    ticketPage,
    ticketPageLoading: ticketPageQueryResult.loading,
    ticketPageError: ticketPageQueryResult.error,
    ticketPageRefetch: ticketPageQueryResult.refetch,

    securityTicketList,
    securityTicketMap,
    securityTicketListLoading: getTicketListQueryResult.loading,
    securityTicketListError: getTicketListQueryResult.error,
    securityTicketListRefetch: getTicketListQueryResult.refetch,
  };
}

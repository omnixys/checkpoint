import { useQuery } from "@apollo/client/react";
import {
  GetEventTreeDocument,
  type GetEventTreeQuery,
  type GetEventTreeQueryVariables,
  GetFullEventTreeInfoDocument,
  type GetFullEventTreeInfoQuery,
  type GetFullEventTreeInfoQueryVariables,
  GetPublicEventTreeDocument,
  type GetPublicEventTreeQuery,
  type GetPublicEventTreeQueryVariables,
} from "@/checkpoint/generated/graphql";

interface Props {
  eventId?: string | undefined;
  loadEventTree?: boolean | undefined;
  loadPublicEventTree?: boolean | undefined;

  loadFullEventTreeInfo?: boolean | undefined;
}

export default function useEventTreeQuery({
  eventId,
  loadEventTree = false,
  loadPublicEventTree = false,
  loadFullEventTreeInfo = false,
}: Props) {
  const eventTreeQueryResult = useQuery<GetEventTreeQuery, GetEventTreeQueryVariables>(
    GetEventTreeDocument,
    {
      variables: { eventId: eventId! },
      fetchPolicy: "cache-and-network",
      skip: !loadEventTree || !eventId,
    },
  );
  const eventTree = eventTreeQueryResult.data?.eventTree;

  const fullEventTreeQueryResult = useQuery<
    GetFullEventTreeInfoQuery,
    GetFullEventTreeInfoQueryVariables
  >(GetFullEventTreeInfoDocument, {
    variables: { eventId: eventId! },
    fetchPolicy: "cache-and-network",
    skip: !loadFullEventTreeInfo || !eventId,
  });
  const fullEventTree = fullEventTreeQueryResult.data?.eventTree;

  const publicEventTreeQueryResult = useQuery<
    GetPublicEventTreeQuery,
    GetPublicEventTreeQueryVariables
  >(GetPublicEventTreeDocument, {
    variables: { eventId: eventId! },
    fetchPolicy: "cache-and-network",
    skip: !loadPublicEventTree || !eventId,
  });
  const publicEventTree = publicEventTreeQueryResult.data?.publicEventTree;

  return {
    eventTree,
    eventTreeLoading: eventTreeQueryResult.loading,
    eventTreeError: eventTreeQueryResult.error,
    eventTreeRefetch: eventTreeQueryResult.refetch,

    publicEventTree,
    publicEventTreeLoading: publicEventTreeQueryResult.loading,
    publicEventTreeError: publicEventTreeQueryResult.error,
    publicEventTreeRefetch: publicEventTreeQueryResult.refetch,

    fullEventTree,
    fullEventTreeLoading: fullEventTreeQueryResult.loading,
    fullEventTreeError: fullEventTreeQueryResult.error,
    fullEventTreeRefetch: fullEventTreeQueryResult.refetch,
  };
}

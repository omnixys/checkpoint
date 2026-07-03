import { useQuery } from "@apollo/client/react";
import {
  GetGlobalEventInvitationListDocument,
  type GetGlobalEventInvitationListQuery,
  type GetGlobalEventInvitationListQueryVariables,
} from "@/checkpoint/generated/graphql";

interface Props {
  eventIds?: string[] | undefined;
  loadGlobalEventInvitationList?: boolean | undefined;
}

export default function useInvitationListQuery({
  eventIds,
  loadGlobalEventInvitationList = false,
}: Props) {
  const globalEventInvitationListQueryResult = useQuery<
    GetGlobalEventInvitationListQuery,
    GetGlobalEventInvitationListQueryVariables
  >(GetGlobalEventInvitationListDocument, {
    variables: { eventIds: eventIds ?? [] },
    skip: !eventIds || eventIds.length === 0 || !loadGlobalEventInvitationList,
  });

  const globalEventInvitationList = globalEventInvitationListQueryResult.data?.getFullByEventIds;
  const invitationMap = new Map(
    globalEventInvitationList?.map((invitation) => [invitation.id, invitation]) ?? [],
  );

  return {
    invitationMap,
    globalEventInvitationList,
    globalEventInvitationListLoading: globalEventInvitationListQueryResult.loading,
    globalEventInvitationListError: globalEventInvitationListQueryResult.error,
    globalEventInvitationListRefetch: globalEventInvitationListQueryResult.refetch,
  };
}

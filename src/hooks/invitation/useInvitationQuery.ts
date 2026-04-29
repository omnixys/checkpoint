import {
  GetInvitationDocument,
  GetInvitationQuery,
  GetInvitationQueryVariables,
  InvitationDocument,
  InvitationQuery,
  InvitationQueryVariables,
  PlusOneInvitationsDocument,
  PlusOneInvitationsQuery,
  PlusOneInvitationsQueryVariables,
} from "@/checkpoint/generated/graphql";
import { useQuery } from "@apollo/client/react";

interface Props {
  invitationId?: string | undefined;
  loadPlusOneInvitationList?: boolean | undefined;
  loadInvitation?: boolean | undefined;
}

export default function useInvitationQuery({
  invitationId,
  loadPlusOneInvitationList = false,
  loadInvitation = false,
}: Props){
  const plusOneInvitationsQueryResult = useQuery<
    PlusOneInvitationsQuery,
    PlusOneInvitationsQueryVariables
  >(PlusOneInvitationsDocument, {
    variables: { invitationId: invitationId ?? '' },
    fetchPolicy: "cache-and-network",
    skip: !loadPlusOneInvitationList || !invitationId,
  });
  const plusOneInvitationList = plusOneInvitationsQueryResult.data?.invitation;

    const invitationQueryResult = useQuery<
      GetInvitationQuery,
      GetInvitationQueryVariables
    >(GetInvitationDocument, {
      variables: { invitationId: invitationId ?? "" },
      fetchPolicy: "cache-and-network",
      skip: !loadInvitation || !invitationId,
    });
  const invitation = invitationQueryResult.data?.invitation;

  return {
    plusOneInvitationList,
    plusOneInvitationListLoading: plusOneInvitationsQueryResult.loading,
    plusOneInvitationListError: plusOneInvitationsQueryResult.error,
    plusOneInvitationListRefetch: plusOneInvitationsQueryResult.refetch,

    invitation,
    invitationLoading: invitationQueryResult.loading,
    invitationError: invitationQueryResult.error,
    invitationRefetch: invitationQueryResult.refetch,
  };
}

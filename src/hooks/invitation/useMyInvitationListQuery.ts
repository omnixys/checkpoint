import { useQuery } from "@apollo/client/react";
import {
  MyInvitationsIdDocument,
  type MyInvitationsIdQuery,
  type MyInvitationsIdQueryVariables,
} from "@/checkpoint/generated/graphql";

interface Props {
  loadMyInvitationIdList?: boolean | undefined;
}

interface Payload {
  myInvitationIdMap: Map<string, MyInvitationsIdQuery["myInvitations"][number]>;
  myInvitationIdList: MyInvitationsIdQuery["myInvitations"] | undefined;
  myInvitationIdListLoading: ReturnType<typeof useQuery>["loading"];
  myInvitationIdListError: ReturnType<typeof useQuery>["error"];
  myInvitationIdListRefetch: ReturnType<typeof useQuery>["refetch"];
}

export default function useMyInvitationQuery({ loadMyInvitationIdList = false }: Props): Payload {
  const myInvitationIdQueryResult = useQuery<MyInvitationsIdQuery, MyInvitationsIdQueryVariables>(
    MyInvitationsIdDocument,
    {
      fetchPolicy: "cache-and-network",
      skip: !loadMyInvitationIdList,
    },
  );

  const myInvitationIdList = myInvitationIdQueryResult.data?.myInvitations;
  const myInvitationIdMap = new Map(
    myInvitationIdList?.map((invitation) => [invitation.eventId, invitation]) ?? [],
  );

  return {
    myInvitationIdMap,
    myInvitationIdList,
    myInvitationIdListLoading: myInvitationIdQueryResult.loading,
    myInvitationIdListError: myInvitationIdQueryResult.error,
    myInvitationIdListRefetch: myInvitationIdQueryResult.refetch,
  };
}

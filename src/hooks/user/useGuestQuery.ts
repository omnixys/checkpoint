import { useQuery } from "@apollo/client/react";
import {
  EventGuestIdListDocument,
  type EventGuestIdListQuery,
  type EventGuestIdListQueryVariables,
  GetGuestListDocument,
  type GetGuestListQuery,
  type GetGuestListQueryVariables,
  GetSecurityGuestInfoDocument,
  type GetSecurityGuestInfoQuery,
  type GetSecurityGuestInfoQueryVariables,
} from "@/checkpoint/generated/graphql";

interface Props {
  eventId?: string | undefined;
  guestIdList?: string[] | undefined;

  loadGuestIdList?: boolean | undefined;
  loadSecurityGuestIdList?: boolean | undefined;
}

export default function useGuestQuery({
  eventId,
  guestIdList,
  loadGuestIdList = false,
  loadSecurityGuestIdList = false,
}: Props) {
  const eventGuestIdListQueryResult = useQuery<
    EventGuestIdListQuery,
    EventGuestIdListQueryVariables
  >(EventGuestIdListDocument, {
    variables: { eventId: eventId! },
    fetchPolicy: "cache-and-network",
    skip: !eventId || !loadGuestIdList,
  });

  const eventGuestIdList = eventGuestIdListQueryResult.data?.eventGuests;

  const guestListQueryResult = useQuery<GetGuestListQuery, GetGuestListQueryVariables>(
    GetGuestListDocument,
    {
      variables: { guestIdList: eventGuestIdList! },
      skip: !eventGuestIdList || eventGuestIdList.length === 0,
      fetchPolicy: "cache-and-network",
    },
  );
  const guestList = guestListQueryResult.data?.getUserList;

  const guestMap = new Map(guestList?.map((guest) => [guest.id, guest]) ?? []);

  const securityGuestListQueryResult = useQuery<
    GetSecurityGuestInfoQuery,
    GetSecurityGuestInfoQueryVariables
  >(GetSecurityGuestInfoDocument, {
    variables: { guestIdList: guestIdList! },
    skip: !loadSecurityGuestIdList || !guestIdList || guestIdList.length === 0,
    fetchPolicy: "cache-and-network",
  });
  const securityGuestList = securityGuestListQueryResult.data?.getUserList;
  const securityGuestMap = new Map(
    securityGuestList?.map((guest) => [
      guest.id,
      `${guest.personalInfo?.firstName} ${guest.personalInfo?.lastName}`,
    ]),
  );

  return {
    guestList,
    guestMap,

    securityGuestMap,
  };
}

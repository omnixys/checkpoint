import {
  EventDocument,
  EventPageDocument,
  EventPageQuery,
  EventPageQueryVariables,
  EventQuery,
  EventQueryVariables,
  GetActiveEventDocument,
  GetActiveEventQuery,
  GetActiveEventQueryVariables,
  GetEventMetaDocument,
  GetEventMetaQuery,
  GetEventMetaQueryVariables,
  GetEventSettingsDocument,
  GetEventSettingsQuery,
  GetEventSettingsQueryVariables,
  GetSubEventNameListDocument,
  GetSubEventNameListQuery,
  GetSubEventNameListQueryVariables,
  MyEventsDocument,
  MyEventsQuery,
} from "@/checkpoint/generated/graphql";
import { useQuery } from "@apollo/client/react";

interface Props {
  eventId?: string | undefined;
  isAuthenticated?: boolean | undefined;

  loadChildrenSettings?: boolean | undefined;
}

export default function useSubEventListQuery({
  eventId,
  loadChildrenSettings = false,
}: Props) {
  const subEventNameListQueryResult = useQuery<
    GetSubEventNameListQuery,
    GetSubEventNameListQueryVariables
  >(GetSubEventNameListDocument, {
    variables: { eventId: eventId! },
    fetchPolicy: "cache-and-network",
    skip: !loadChildrenSettings || !eventId,
  });
  const subEventNameList = subEventNameListQueryResult.data?.eventChildren;


  return {
    subEventNameList,
    subEventNameListLoading: subEventNameListQueryResult.loading,
    subEventNameListError: subEventNameListQueryResult.error,
    subEventNameListRefetch: subEventNameListQueryResult.refetch,
  };
}

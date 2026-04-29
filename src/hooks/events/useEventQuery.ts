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
  MyEventsDocument,
  MyEventsQuery,
} from "@/checkpoint/generated/graphql";
import { useQuery } from "@apollo/client/react";

interface Props {
  eventId?: string | undefined;
  isAuthenticated?: boolean | undefined;

  loadEventPage?: boolean | undefined;
  loadEventMeta?: boolean | undefined;
  loadMyEventList?: boolean | undefined;
  loadActiveEvent?: boolean | undefined;
  loadEventSettings?: boolean | undefined;
}

export default function useEventQuery({
  eventId,
  isAuthenticated = false,
  loadEventPage = false,
  loadEventMeta = false,
  loadMyEventList = false,
  loadActiveEvent = false,
    loadEventSettings = false,
}: Props) {
  const eventPageQueryResult = useQuery<
    EventPageQuery,
    EventPageQueryVariables
  >(EventPageDocument, {
    variables: { eventId: eventId! },
    fetchPolicy: "cache-and-network",
    skip: !isAuthenticated || !loadEventPage || !eventId,
  });
  const eventPage = eventPageQueryResult.data?.event;

  const eventMetaInfoQueryResult = useQuery<
    GetEventMetaQuery,
    GetEventMetaQueryVariables
  >(GetEventMetaDocument, {
    variables: { eventId: eventId! },
    fetchPolicy: "cache-and-network",
    skip: !loadEventMeta || !eventId,
  });
  const eventMetaInfo = eventMetaInfoQueryResult.data?.event;

  const myEventListQueryResult = useQuery<MyEventsQuery>(MyEventsDocument, {
    skip: !isAuthenticated || !loadMyEventList,
    fetchPolicy: "cache-first",
  });

  const myEventList = myEventListQueryResult.data?.myEvents;

  const activeEventQueryResult = useQuery<
    GetActiveEventQuery,
    GetActiveEventQueryVariables
  >(GetActiveEventDocument, {
      skip: !eventId || !loadActiveEvent,
      variables: { eventId: eventId! },
      fetchPolicy: "cache-and-network",
    },
  );

  const activeEvent = activeEventQueryResult.data?.event;


    const eventSettingsQueryResult = useQuery<
      GetEventSettingsQuery,
      GetEventSettingsQueryVariables
    >(GetEventSettingsDocument, {
      variables: { eventId: eventId ?? "" },
      fetchPolicy: "cache-and-network",
      skip: !loadEventSettings || !eventId,
    });
  const eventSettings = eventSettingsQueryResult.data?.event;
  
  return {
    eventPage,
    eventPageLoading: eventPageQueryResult.loading,
    eventPageError: eventPageQueryResult.error,
    eventPageRefetch: eventPageQueryResult.refetch,

    eventMetaInfo,
    eventMetaInfoLoading: eventMetaInfoQueryResult.loading,
    eventMetaInfoError: eventMetaInfoQueryResult.error,
    eventMetaInfoRefetch: eventMetaInfoQueryResult.refetch,

    myEventList,
    myEventListLoading: myEventListQueryResult.loading,
    myEventListError: myEventListQueryResult.error,
    myEventListRefetch: myEventListQueryResult.refetch,

    activeEvent,
    activeEventLoading: activeEventQueryResult.loading,
    activeEventError: activeEventQueryResult.error,
    activeEventRefetch: activeEventQueryResult.refetch,

    eventSettings,
    eventSettingsLoading: eventSettingsQueryResult.loading,
    eventSettingsError: eventSettingsQueryResult.error,
    eventSettingsRefetch: eventSettingsQueryResult.refetch,
  };
}

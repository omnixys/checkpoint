"use client";

import { useQuery, useSubscription } from "@apollo/client/react";
import { useEffect, useMemo } from "react";
import {
  EventInternalConversationsDocument,
  EventInternalMessageReceivedDocument,
} from "@/checkpoint/generated/graphql";
import { getLogger } from "@/checkpoint/utils/logger";

const logger = getLogger("InternalNavigationUnread");

export function useInternalNavigationUnread(eventId?: string, enabled = true): number {
  const shouldSkip = !eventId || !enabled;
  const { data, refetch } = useQuery(EventInternalConversationsDocument, {
    variables: { eventId: eventId ?? "" },
    skip: shouldSkip,
    fetchPolicy: "cache-and-network",
  });
  const messageEvents = useSubscription(EventInternalMessageReceivedDocument, {
    skip: shouldSkip,
  });

  useEffect(() => {
    if (!messageEvents.data?.internalMessageReceived || shouldSkip) return;
    void refetch();
  }, [messageEvents.data, refetch, shouldSkip]);

  useEffect(() => {
    if (messageEvents.error)
      logger.error("Messages badge subscription failed", messageEvents.error);
  }, [messageEvents.error]);

  return useMemo(() => {
    if (shouldSkip) return 0;
    return (data?.internalConversations ?? []).reduce(
      (total, conversation) => total + (conversation.unreadCount ?? 0),
      0,
    );
  }, [data, shouldSkip]);
}

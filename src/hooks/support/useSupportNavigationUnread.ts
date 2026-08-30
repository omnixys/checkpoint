"use client";

import { useQuery, useSubscription } from "@apollo/client/react";
import { useEffect, useMemo } from "react";
import {
  EventSupportConversationsChangedDocument,
  type SupportConversation,
  SupportConversationsByEventDocument,
} from "@/checkpoint/generated/graphql";
import { getLogger } from "@/checkpoint/utils/logger";

const logger = getLogger("SupportNavigationUnread");

export function useSupportNavigationUnread(eventId?: string, enabled = true): number {
  const shouldSkip = !eventId || !enabled;
  const { data, refetch } = useQuery(SupportConversationsByEventDocument, {
    variables: { eventId: eventId ?? "" },
    skip: shouldSkip,
    fetchPolicy: "cache-and-network",
  });
  const eventChanges = useSubscription(EventSupportConversationsChangedDocument, {
    variables: { eventId: eventId ?? "" },
    skip: shouldSkip,
  });

  useEffect(() => {
    if (!eventChanges.data?.eventConversationsChanged || shouldSkip) return;
    void refetch();
  }, [eventChanges.data, refetch, shouldSkip]);

  useEffect(() => {
    if (eventChanges.error) logger.error("Support badge subscription failed", eventChanges.error);
  }, [eventChanges.error]);

  return useMemo(() => {
    if (shouldSkip) return 0;
    return ((data?.supportConversationsByEvent ?? []) as SupportConversation[]).reduce(
      (total, conversation) => total + (conversation.unreadCount ?? 0),
      0,
    );
  }, [data, shouldSkip]);
}

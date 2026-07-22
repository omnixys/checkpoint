"use client";

import { useQuery, useSubscription } from "@apollo/client/react";
import { useCallback, useMemo } from "react";
import {
  ConversationsDocument,
  ConversationUpdatedDocument,
  type Conversation,
} from "@/checkpoint/generated/graphql";

export interface ConversationUnreadInfo {
  id: string;
  unreadCount: number;
}

export function useConversationUnread(_eventId?: string) {
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<{ conversations: Conversation[] }>(
    ConversationsDocument,
    {
      fetchPolicy: "cache-and-network",
    },
  );

  const conversations = useMemo(
    () =>
      (data?.conversations ?? []).map((c) => ({
        id: c.id,
        unreadCount: c.unreadCount,
      })),
    [data],
  );

  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    [conversations],
  );

  const markAsRead = useCallback(async (_conversationId: string) => {
    // No equivalent in new backend
  }, []);

  return {
    conversations,
    totalUnread,
    loading,
    error,
    refetch,
    markAsRead,
  };
}

export function useConversationUnreadSubscription(_conversationId?: string | null) {
  const { data } = useSubscription<{
    conversationUpdated: Conversation;
  }>(ConversationUpdatedDocument);

  const unreadUpdate = useMemo(() => {
    if (!data?.conversationUpdated) return null;
    const conv = data.conversationUpdated;
    return {
      conversationId: conv.id,
      unreadCount: conv.unreadCount,
      eventId: "",
    };
  }, [data]);

  return { unreadUpdate };
}

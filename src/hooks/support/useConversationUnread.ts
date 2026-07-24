"use client";

import { useQuery, useSubscription } from "@apollo/client/react";
import { useCallback, useMemo } from "react";
import {
  type Conversation,
  ConversationsDocument,
  type ConversationType,
  ConversationUpdatedDocument,
} from "@/checkpoint/generated/graphql";

export interface ConversationUnreadInfo {
  id: string;
  unreadCount: number;
}

export function useConversationUnread(_eventId?: string, filterType?: ConversationType) {
  const { data, loading, error, refetch } = useQuery<{ conversations: Conversation[] }>(
    ConversationsDocument,
    {
      fetchPolicy: "cache-and-network",
    },
  );

  const conversations = useMemo(() => {
    const all = data?.conversations ?? [];
    const filtered = filterType ? all.filter((c) => c.type === filterType) : all;
    return filtered.map((c) => ({
      id: c.id,
      unreadCount: c.unreadCount,
    }));
  }, [data, filterType]);

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

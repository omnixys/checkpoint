"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { useCallback, useMemo } from "react";

export interface ConversationUnreadInfo {
  id: string;
  eventId: string;
  guestUserId?: string | null;
  guestName: string;
  channel: string;
  unreadCount?: number | null;
  lastMessageAt?: string | null;
  lastMessagePreview?: string | null;
  status: string;
  assignedTo?: string | null;
  updatedAt: string;
}

const UNREAD_COUNTS_QUERY = gql`
  query UnreadCountsByEvent($eventId: String!) {
    unreadCountsByEvent(eventId: $eventId) {
      id
      eventId
      guestUserId
      guestName
      channel
      unreadCount
      lastMessageAt
      lastMessagePreview
      status
      assignedTo
      updatedAt
    }
  }
`;

const MARK_AS_READ_MUTATION = gql`
  mutation MarkConversationAsRead($conversationId: String!) {
    markConversationAsRead(conversationId: $conversationId) {
      id
      unreadCount
    }
  }
`;

const UNREAD_SUBSCRIPTION = gql`
  subscription ConversationUnreadUpdated($conversationId: String!) {
    conversationUnreadUpdated(conversationId: $conversationId) {
      conversationId
      unreadCount
      eventId
    }
  }
`;

export function useConversationUnread(eventId?: string) {
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<{ unreadCountsByEvent: ConversationUnreadInfo[] }>(
    UNREAD_COUNTS_QUERY,
    {
      variables: { eventId },
      skip: !eventId,
      fetchPolicy: "cache-and-network",
    },
  );

  const conversations = data?.unreadCountsByEvent ?? [];

  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0),
    [conversations],
  );

  const [markAsReadMutation] = useMutation<{
    markConversationAsRead: { id: string; unreadCount: number };
  }>(MARK_AS_READ_MUTATION);

  const markAsRead = useCallback(
    async (conversationId: string) => {
      await markAsReadMutation({
        variables: { conversationId },
        optimisticResponse: {
          markConversationAsRead: { id: conversationId, unreadCount: 0 },
        },
      });
    },
    [markAsReadMutation],
  );

  return {
    conversations,
    totalUnread,
    loading,
    error,
    refetch,
    markAsRead,
  };
}

export function useConversationUnreadSubscription(conversationId?: string | null) {
  const { data } = useSubscription<{
    conversationUnreadUpdated: {
      conversationId: string;
      unreadCount: number;
      eventId: string;
    };
  }>(UNREAD_SUBSCRIPTION, {
    variables: { conversationId },
    skip: !conversationId,
  });

  return { unreadUpdate: data?.conversationUnreadUpdated ?? null };
}

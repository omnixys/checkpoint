"use client";

import { useLazyQuery, useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  EventInternalConversationsDocument,
  EventInternalMessageReceivedDocument,
  EventInternalMessagesDocument,
  type EventInternalMessagesQuery,
  MarkEventInternalConversationReadDocument,
  SendEventInternalMessageDocument,
} from "@/checkpoint/generated/graphql";
import { appendMessageById } from "./message-stream";

export function useEventInternalMessages(eventId?: string, initialSelectedId?: string | null) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<EventInternalMessagesQuery["internalMessages"]>([]);
  const autoLoadedRef = useRef(false);
  const prevInitialSelectedRef = useRef(initialSelectedId);
  useEffect(() => {
    if (prevInitialSelectedRef.current !== initialSelectedId) {
      prevInitialSelectedRef.current = initialSelectedId;
      autoLoadedRef.current = false;
      setSelectedId(null);
    }
  }, [initialSelectedId]);
  const {
    data,
    loading: conversationsLoading,
    refetch,
    error: conversationsError,
  } = useQuery(EventInternalConversationsDocument, {
    variables: { eventId: eventId ?? "" },
    skip: !eventId,
    fetchPolicy: "cache-and-network",
  });
  const [loadMessages, { loading: messagesLoading, error: messagesError }] = useLazyQuery(
    EventInternalMessagesDocument,
  );
  const [sendMutation] = useMutation(SendEventInternalMessageDocument);
  const [markRead] = useMutation(MarkEventInternalConversationReadDocument);

  const select = useCallback(
    async (conversationId: string) => {
      setSelectedId(conversationId);
      const result = await loadMessages({ variables: { conversationId, limit: 100 } });
      if (result.data?.internalMessages) {
        setMessages(result.data.internalMessages);
      }
      await markRead({ variables: { conversationId } });
      return result.data?.internalMessages ?? [];
    },
    [loadMessages, markRead],
  );

  // Preselect the conversation referenced by a deep link once conversations load.
  useEffect(() => {
    const target = initialSelectedId;
    if (!target || !data?.internalConversations?.length || autoLoadedRef.current) return;
    const exists = data.internalConversations.some((conversation) => conversation.id === target);
    if (!exists) return;
    autoLoadedRef.current = true;
    void select(target);
  }, [data, initialSelectedId, select]);

  const send = useCallback(
    async (body: string) => {
      if (!selectedId || !body.trim()) return;
      const result = await sendMutation({
        variables: { conversationId: selectedId, body: body.trim() },
      });
      const message = result.data?.sendInternalMessage;
      if (message) setMessages((current) => appendMessageById(current, message));
      await refetch();
      return message ?? null;
    },
    [refetch, selectedId, sendMutation],
  );

  useSubscription(EventInternalMessageReceivedDocument, {
    skip: !selectedId,
    onData: ({ data: result }) => {
      const message = result.data?.internalMessageReceived;
      if (message?.conversationId === selectedId) {
        setMessages((current) => appendMessageById(current, message));
      }
      void refetch();
    },
  });

  const conversations = data?.internalConversations ?? [];
  const totalUnread = conversations.reduce(
    (total, conversation) => total + (conversation.unreadCount ?? 0),
    0,
  );

  return {
    conversations,
    conversationsLoading,
    conversationsError: conversationsError ?? null,
    messages,
    messagesLoading,
    messagesError: messagesError ?? null,
    selectedId,
    setSelectedId,
    select,
    send,
    totalUnread,
  };
}

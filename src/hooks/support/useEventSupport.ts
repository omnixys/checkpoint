"use client";

import { useLazyQuery, useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { useCallback, useMemo, useState } from "react";
import {
  type Conversation,
  ConversationsDocument,
  CreateWhatsappConversationDocument,
  type Message,
  MessageReceivedDocument,
  MessagesDocument,
  SendMessageDocument,
} from "@/checkpoint/generated/graphql";
import { appendMessageById, mergeMessagesById } from "@/checkpoint/hooks/internal/message-stream";

export type { Conversation, Message };

export function useEventSupport(_eventId?: string, _currentUserId?: string) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [realtimeByConversation, setRealtimeByConversation] = useState<Record<string, Message[]>>(
    {},
  );
  const [fetchedMessages, setFetchedMessages] = useState<Record<string, Message[]>>({});

  const {
    data: conversationsData,
    loading: conversationsLoading,
    refetch: refetchConversations,
  } = useQuery<{ conversations: Conversation[] }>(ConversationsDocument, {
    fetchPolicy: "cache-and-network",
  });

  const conversations = conversationsData?.conversations ?? [];

  const [loadMessages] = useLazyQuery<{ messages: Message[] }>(MessagesDocument);

  const [sendMessageMutation] = useMutation(SendMessageDocument);

  const [createWhatsappConversationMutation] = useMutation(CreateWhatsappConversationDocument);

  useSubscription<{ messageReceived: Message }>(MessageReceivedDocument, {
    variables: { conversationId: selectedId ?? "" },
    skip: !selectedId,
    onData: ({ data: result }) => {
      const message = result.data?.messageReceived;
      if (message?.conversationId === selectedId) {
        setRealtimeByConversation((current) => ({
          ...current,
          [message.conversationId]: appendMessageById(
            current[message.conversationId] ?? [],
            message,
          ),
        }));
      }
    },
  });

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      setSelectedId(conversationId);
      const result = await loadMessages({
        variables: { conversationId, limit: 100 },
      });
      const msgs = result.data?.messages ?? [];
      setFetchedMessages((prev) => ({ ...prev, [conversationId]: msgs }));
      return msgs;
    },
    [loadMessages],
  );

  const messages = useMemo(() => {
    if (!selectedId) return [];
    return mergeMessagesById(
      fetchedMessages[selectedId] ?? [],
      realtimeByConversation[selectedId] ?? [],
    );
  }, [selectedId, fetchedMessages, realtimeByConversation]);

  const sendMessage = useCallback(
    async (conversationId: string, body: string) => {
      const result = await sendMessageMutation({
        variables: { conversationId, body },
      });
      return result.data?.sendMessage ?? null;
    },
    [sendMessageMutation],
  );

  const createConversation = useCallback(
    async (
      _guestName: string,
      _firstMessage: string,
      channel = "WHATSAPP",
      phoneNumber?: string,
    ) => {
      if (channel === "WHATSAPP") {
        const result = await createWhatsappConversationMutation({
          variables: { phoneNumber: phoneNumber ?? _guestName, displayName: _guestName },
        });
        await refetchConversations();
        return result.data?.createWhatsappConversation ?? null;
      }
      return null;
    },
    [createWhatsappConversationMutation, refetchConversations],
  );

  return {
    unassigned: conversations,
    unassignedLoading: conversationsLoading,
    assigned: [] as Conversation[],
    assignedLoading: false,
    selectedId,
    setSelectedId,
    messages,
    messagesLoading: false,
    fetchMessages,
    sendMessage,
    assignToMe: async () => null,
    unassign: async () => null,
    close: async () => null,
    createConversation,
    refetchAll: useCallback(() => {
      refetchConversations();
    }, [refetchConversations]),
  };
}

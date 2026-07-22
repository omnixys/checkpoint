"use client";

import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { useCallback } from "react";
import {
  ConversationsDocument,
  CreateWhatsappConversationDocument,
  SendMessageDocument,
  MessagesDocument,
  type Conversation,
  type Message,
} from "@/checkpoint/generated/graphql";

export type { Conversation, Message };

export function useEventSupport(_eventId?: string, _currentUserId?: string) {
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

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      const result = await loadMessages({
        variables: { conversationId, limit: 100 },
      });
      return result.data?.messages ?? [];
    },
    [loadMessages],
  );

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
    async (_guestName: string, _firstMessage: string, channel = "WHATSAPP") => {
      if (channel === "WHATSAPP") {
        const result = await createWhatsappConversationMutation({
          variables: { phoneNumber: _guestName, displayName: _guestName },
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

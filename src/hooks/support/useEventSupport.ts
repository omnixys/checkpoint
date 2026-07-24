"use client";

import { useLazyQuery, useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  type Conversation,
  ConversationsDocument,
  ConversationType,
  CreateWhatsappConversationDocument,
  type Message,
  MessageReceivedDocument,
  MessagesDocument,
  SendMessageDocument,
} from "@/checkpoint/generated/graphql";
import { appendMessageById, mergeMessagesById } from "@/checkpoint/hooks/internal/message-stream";

export type { Conversation, Message };

export type SupportChannel = "WHATSAPP" | "IN_APP" | "EMAIL";

export function useEventSupport(_eventId?: string, _currentUserId?: string) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;
  const [channel, setChannel] = useState<SupportChannel>("WHATSAPP");
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

  const allConversations = conversationsData?.conversations ?? [];

  const conversations = useMemo(() => {
    return allConversations.filter((c) => {
      if (channel === "WHATSAPP") return c.channel === "WHATSAPP";
      if (channel === "EMAIL") return c.channel === "EMAIL";
      return c.channel === "IN_APP" && c.type === ConversationType.SUPPORT;
    });
  }, [allConversations, channel]);

  const [loadMessages] = useLazyQuery<{ messages: Message[] }>(MessagesDocument);

  const [sendMessageMutation] = useMutation(SendMessageDocument);

  const [createWhatsappConversationMutation] = useMutation(CreateWhatsappConversationDocument);

  useSubscription<{ messageReceived: Message }>(MessageReceivedDocument, {
    variables: { conversationId: selectedId ?? "" },
    skip: !selectedId,
    onData: ({ data: result }) => {
      const message = result.data?.messageReceived;
      const currentSelectedId = selectedIdRef.current;
      if (message?.conversationId === currentSelectedId) {
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
      const message = result.data?.sendMessage;
      if (message) {
        setRealtimeByConversation((current) => ({
          ...current,
          [conversationId]: appendMessageById(current[conversationId] ?? [], message),
        }));
      }
      return message ?? null;
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
    conversations,
    conversationsLoading,
    selectedId,
    setSelectedId,
    channel,
    setChannel,
    messages,
    messagesLoading: false,
    fetchMessages,
    sendMessage,
    close: async () => null,
    createConversation,
    refetchAll: useCallback(() => {
      refetchConversations();
    }, [refetchConversations]),
  };
}

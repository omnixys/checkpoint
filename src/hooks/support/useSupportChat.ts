"use client";

import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type Conversation,
  ConversationsDocument,
  ConversationType,
  CreateInAppConversationDocument,
  type Message,
  MessageReceivedDocument,
  MessagesDocument,
  SendMessageDocument,
} from "@/checkpoint/generated/graphql";
import { conversationsOfType } from "@/checkpoint/hooks/internal/conversation-selection";
import { appendMessageById, mergeMessagesById } from "@/checkpoint/hooks/internal/message-stream";

export type SupportMessage = Message;

interface SupportConversation {
  id: string;
  type: string;
  channel: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  participants: Array<{ userId: string }>;
  createdAt?: string;
  updatedAt?: string;
}

interface UseSupportChatOptions {
  conversationId?: string | null;
  invitationId?: string | null;
  eventId?: string;
  guestName?: string;
}

export function useSupportChat({
  conversationId: initialConversationId,
}: UseSupportChatOptions = {}) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [realtimeByConversation, setRealtimeByConversation] = useState<Record<string, Message[]>>(
    {},
  );
  const [isCreating, setIsCreating] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);

  const {
    data: messagesData,
    loading: messagesLoading,
    error: messagesError,
    fetchMore: fetchMoreMessages,
  } = useQuery<{ messages: Message[] }>(MessagesDocument, {
    variables: { conversationId: conversationId ?? "", limit: 50 },
    skip: !conversationId,
  });

  const { data: myConversationsData, loading: conversationsLoading } = useQuery<{
    conversations: Conversation[];
  }>(ConversationsDocument, { fetchPolicy: "cache-and-network" });

  const supportConversations = useMemo(
    () => conversationsOfType(myConversationsData?.conversations ?? [], ConversationType.SUPPORT),
    [myConversationsData],
  );

  useEffect(() => {
    if (
      initialConversationId &&
      supportConversations.some((conversation) => conversation.id === initialConversationId)
    ) {
      setConversationId(initialConversationId);
    }
  }, [initialConversationId, supportConversations]);

  const [sendMessageMutation, { loading: sending }] = useMutation<{
    sendMessage: Message;
  }>(SendMessageDocument);

  const [createConversation] = useMutation<{
    createInAppConversation: Conversation;
  }>(CreateInAppConversationDocument);

  const { data: subscriptionData } = useSubscription<{
    messageReceived: Message;
  }>(MessageReceivedDocument, {
    variables: { conversationId: conversationId ?? "" },
    skip: !conversationId,
    onData: ({ data: result }) => {
      const message = result.data?.messageReceived;
      if (message?.conversationId === conversationId) {
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

  const messages = useMemo(
    () =>
      mergeMessagesById(
        messagesData?.messages ?? [],
        conversationId ? (realtimeByConversation[conversationId] ?? []) : [],
      ),
    [conversationId, messagesData, realtimeByConversation],
  );

  const sendMessage = useCallback(
    async (body: string) => {
      if (!conversationId || !body.trim()) return;
      const result = await sendMessageMutation({
        variables: { conversationId, body: body.trim() },
      });
      const message = result.data?.sendMessage;
      if (message) {
        setRealtimeByConversation((current) => ({
          ...current,
          [message.conversationId]: appendMessageById(
            current[message.conversationId] ?? [],
            message,
          ),
        }));
      }
    },
    [conversationId, sendMessageMutation],
  );

  const initializeConversation = useCallback(
    async (opts: {
      eventId: string;
      guestName: string;
      firstMessage?: string;
      invitationId?: string;
    }) => {
      setIsCreating(true);
      setCreationError(null);
      try {
        const result = await createConversation({
          variables: {
            participantUserId: opts.guestName,
            conversationType: ConversationType.SUPPORT,
          },
        });
        const conv = result.data?.createInAppConversation;
        if (conv) {
          setConversationId(conv.id);
        }
      } catch (err) {
        setCreationError(err instanceof Error ? err.message : "Failed to create conversation");
      } finally {
        setIsCreating(false);
      }
    },
    [createConversation],
  );

  const latestMessage = subscriptionData?.messageReceived ?? null;

  const loadMore = useCallback(() => {
    if (!conversationId) return;
    fetchMoreMessages({
      variables: { conversationId, limit: 50, before: messages[0]?.createdAt },
    });
  }, [conversationId, fetchMoreMessages, messages]);

  return {
    conversationId,
    messages,
    latestMessage,
    sendMessage,
    sending,
    initializeConversation,
    isCreating,
    creationError,
    messagesLoading,
    messagesError,
    conversationsLoading,
    myConversations: supportConversations as SupportConversation[],
    loadMore,
  };
}

"use client";

import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { useCallback, useEffect, useState } from "react";
import {
  ConversationsDocument,
  CreateInAppConversationDocument,
  SendMessageDocument,
  MessagesDocument,
  MessageReceivedDocument,
  type Conversation,
  type Message,
} from "@/checkpoint/generated/graphql";

export type SupportMessage = Message;

interface SupportConversation {
  id: string;
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
  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId ?? null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);

  const {
    data: messagesData,
    loading: messagesLoading,
    error: messagesError,
    fetchMore: fetchMoreMessages,
  } = useQuery<{ messages: Message[] }>(
    MessagesDocument,
    {
      variables: { conversationId: conversationId ?? "", limit: 50 },
      skip: !conversationId,
    },
  );

  const {
    data: myConversationsData,
    loading: conversationsLoading,
  } = useQuery<{ conversations: Conversation[] }>(
    ConversationsDocument,
    { skip: !!conversationId },
  );

  useEffect(() => {
    if (conversationId) return;
    const convs = myConversationsData?.conversations;
    if (!convs || convs.length === 0) return;
    const active = convs[0];
    if (active) {
      setConversationId(active.id);
    }
  }, [myConversationsData, conversationId]);

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
  });

  const messages = messagesData?.messages ?? [];

  const sendMessage = useCallback(
    async (body: string) => {
      if (!conversationId || !body.trim()) return;
      await sendMessageMutation({
        variables: { conversationId, body: body.trim() },
      });
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
          },
        });
        const conv = result.data?.createInAppConversation;
        if (conv) {
          setConversationId(conv.id);
        }
      } catch (err) {
        setCreationError(
          err instanceof Error ? err.message : "Failed to create conversation",
        );
      } finally {
        setIsCreating(false);
      }
    },
    [createConversation],
  );

  const latestMessage =
    subscriptionData?.messageReceived ?? null;

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
    myConversations: (myConversationsData?.conversations ?? []) as SupportConversation[],
    loadMore,
  };
}

"use client";

import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

export type PendingMessage = {
  id: string;
  body: string;
  status: "sending" | "sent" | "failed";
  createdAt: string;
};

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
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);
  const creatingRef = useRef(false);

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
      if (!body.trim()) return;

      const pendingId = `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const pending: PendingMessage = {
        id: pendingId,
        body: body.trim(),
        status: "sending",
        createdAt: new Date().toISOString(),
      };
      setPendingMessages((prev) => [...prev, pending]);

      try {
        let activeConversationId = conversationId;

        if (!activeConversationId) {
          if (creatingRef.current) {
            setPendingMessages((prev) =>
              prev.map((m) => (m.id === pendingId ? { ...m, status: "failed" as const } : m)),
            );
            return;
          }

          creatingRef.current = true;
          setIsCreating(true);
          setCreationError(null);

          try {
            const result = await createConversation({
              variables: {
                participantUserId: "support",
                conversationType: ConversationType.SUPPORT,
              },
            });
            const conv = result.data?.createInAppConversation;
            if (!conv) {
              throw new Error("Failed to create conversation");
            }
            activeConversationId = conv.id;
            setConversationId(conv.id);
          } catch (err) {
            setCreationError(err instanceof Error ? err.message : "Failed to create conversation");
            setPendingMessages((prev) =>
              prev.map((m) => (m.id === pendingId ? { ...m, status: "failed" as const } : m)),
            );
            return;
          } finally {
            creatingRef.current = false;
            setIsCreating(false);
          }
        }

        const result = await sendMessageMutation({
          variables: { conversationId: activeConversationId, body: body.trim() },
        });
        const message = result.data?.sendMessage;
        if (message) {
          setPendingMessages((prev) => prev.filter((m) => m.id !== pendingId));
          setRealtimeByConversation((current) => ({
            ...current,
            [message.conversationId]: appendMessageById(
              current[message.conversationId] ?? [],
              message,
            ),
          }));
        } else {
          setPendingMessages((prev) =>
            prev.map((m) => (m.id === pendingId ? { ...m, status: "failed" as const } : m)),
          );
        }
      } catch {
        setPendingMessages((prev) =>
          prev.map((m) => (m.id === pendingId ? { ...m, status: "failed" as const } : m)),
        );
      }
    },
    [conversationId, sendMessageMutation, createConversation],
  );

  const retryMessage = useCallback(
    async (pending: PendingMessage) => {
      setPendingMessages((prev) => prev.filter((m) => m.id !== pending.id));
      await sendMessage(pending.body);
    },
    [sendMessage],
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
    pendingMessages,
    latestMessage,
    sendMessage,
    retryMessage,
    sending,
    isCreating,
    creationError,
    messagesLoading,
    messagesError,
    conversationsLoading,
    myConversations: supportConversations as SupportConversation[],
    loadMore,
  };
}

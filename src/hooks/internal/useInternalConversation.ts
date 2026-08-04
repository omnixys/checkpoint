"use client";

import { useLazyQuery, useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { useAnalytics } from "@/checkpoint/providers/AnalyticsProvider";
import { findDirectConversation } from "./conversation-selection";
import { appendMessageById } from "./message-stream";

export type { Conversation, Message };

export function useInAppConversation(currentUserId?: string) {
  const analytics = useAnalytics();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const sendDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sendingRef = useRef(false);
  const selectionRequestRef = useRef(0);
  const messageRequestRef = useRef(0);

  const {
    data: conversationsData,
    loading: conversationsLoading,
    refetch: refetchConversations,
  } = useQuery<{ conversations: Conversation[] }>(ConversationsDocument, {
    fetchPolicy: "cache-and-network",
  });

  const conversations = (conversationsData?.conversations ?? []).filter(
    (conversation) =>
      conversation.channel === "IN_APP" && conversation.type === ConversationType.DIRECT,
  );

  const [fetchMessages] = useLazyQuery<{ messages: Message[] }>(MessagesDocument);

  const loadMessages = useCallback(
    async (conversationId: string) => {
      const requestId = ++messageRequestRef.current;
      setMessagesLoading(true);
      try {
        const { data } = await fetchMessages({ variables: { conversationId, limit: 100 } });
        if (data && requestId === messageRequestRef.current) {
          setMessages(data.messages);
        }
      } finally {
        if (requestId === messageRequestRef.current) {
          setMessagesLoading(false);
        }
      }
    },
    [fetchMessages],
  );

  useEffect(() => {
    if (selectedConversationId) loadMessages(selectedConversationId);
  }, [selectedConversationId, loadMessages]);

  const [createConversationMutation] = useMutation(CreateInAppConversationDocument);

  const [sendMessageMutation] = useMutation(SendMessageDocument);

  useSubscription(MessageReceivedDocument, {
    variables: { conversationId: selectedConversationId ?? "" },
    skip: !selectedConversationId,
    onData: ({ data: result }) => {
      const msg = result.data?.messageReceived;
      if (msg && msg.conversationId === selectedConversationId) {
        setMessages((previous) => appendMessageById(previous, msg));
      }
    },
  });

  const conversationsRef = useRef(conversations);
  conversationsRef.current = conversations;

  const findOrCreateDirectConversation = useCallback(
    async (targetUserId: string) => {
      const selectionRequestId = ++selectionRequestRef.current;
      try {
        const existing = findDirectConversation(
          conversationsRef.current,
          currentUserId,
          targetUserId,
        );
        if (existing) {
          analytics.track("ConversationOpened", { conversationId: existing.id });
          if (selectionRequestId === selectionRequestRef.current) {
            setMessages([]);
            setSelectedConversationId(existing.id);
          }
          return existing.id;
        }
        const { data } = await createConversationMutation({
          variables: {
            participantUserId: targetUserId,
            conversationType: ConversationType.DIRECT,
          },
        });
        if (data && selectionRequestId === selectionRequestRef.current) {
          const conv = data.createInAppConversation;
          analytics.track("ConversationOpened", { conversationId: conv.id });
          setMessages([]);
          setSelectedConversationId(conv.id);
          refetchConversations();
          return conv.id;
        }
      } catch (err) {
        console.error("Failed to create in-app conversation", err);
      }
      return undefined;
    },
    [analytics, createConversationMutation, currentUserId, refetchConversations],
  );

  const sendMessage = useCallback(
    async (body: string) => {
      if (!selectedConversationId || !body.trim() || sendingRef.current) return null;
      analytics.track("MessageSendStarted", { conversationId: selectedConversationId });
      sendingRef.current = true;
      try {
        const { data } = await sendMessageMutation({
          variables: { conversationId: selectedConversationId, body },
        });
        if (data) {
          analytics.track("MessageSent", { conversationId: selectedConversationId });
          setMessages((previous) => appendMessageById(previous, data.sendMessage));
          return data.sendMessage;
        }
      } catch (err) {
        analytics.track("MessageSendFailed", {
          conversationId: selectedConversationId,
          errorCode: "SEND_FAILED",
        });
        console.error("Failed to send message", err);
      } finally {
        sendingRef.current = false;
      }
      return null;
    },
    [analytics, selectedConversationId, sendMessageMutation],
  );

  const debouncedSend = useCallback(
    (body: string) => {
      if (sendDebounceRef.current) clearTimeout(sendDebounceRef.current);
      return new Promise<Message | null>((resolve) => {
        sendDebounceRef.current = setTimeout(async () => {
          const result = await sendMessage(body);
          resolve(result);
        }, 300);
      });
    },
    [sendMessage],
  );

  return {
    conversations,
    conversationsLoading,
    selectedConversationId,
    messages,
    messagesLoading,
    findOrCreateDirectConversation,
    sendMessage: debouncedSend,
    loadMessages,
  };
}

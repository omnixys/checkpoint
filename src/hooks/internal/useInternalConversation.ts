"use client";

import { useLazyQuery, useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ConversationsDocument,
  CreateInAppConversationDocument,
  SendMessageDocument,
  MessagesDocument,
  MessageReceivedDocument,
  type Conversation,
  type Message,
} from "@/checkpoint/generated/graphql";

export type { Conversation, Message };

export function useInAppConversation(currentUserId?: string) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const sendDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sendingRef = useRef(false);
  const creatingRef = useRef(false);

  const {
    data: conversationsData,
    loading: conversationsLoading,
    refetch: refetchConversations,
  } = useQuery<{ conversations: Conversation[] }>(ConversationsDocument, {
    fetchPolicy: "cache-and-network",
  });

  const conversations = (conversationsData?.conversations ?? []).filter(
    (c) => c.channel === "IN_APP",
  );

  const [fetchMessages] = useLazyQuery<{ messages: Message[] }>(MessagesDocument);

  const loadMessages = useCallback(
    async (conversationId: string) => {
      setMessagesLoading(true);
      try {
        const { data } = await fetchMessages({ variables: { conversationId, limit: 100 } });
        if (data) setMessages(data.messages);
      } finally {
        setMessagesLoading(false);
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
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    },
  });

  const conversationsRef = useRef(conversations);
  conversationsRef.current = conversations;

  const findOrCreateDirectConversation = useCallback(
    async (targetUserId: string) => {
      if (creatingRef.current) return undefined;
      creatingRef.current = true;
      try {
        const existing = conversationsRef.current.find((c) =>
          c.participants.some((p) => p.userId === targetUserId),
        );
        if (existing) {
          setSelectedConversationId(existing.id);
          return existing.id;
        }
        const { data } = await createConversationMutation({
          variables: { participantUserId: targetUserId },
        });
        if (data) {
          const conv = data.createInAppConversation;
          setSelectedConversationId(conv.id);
          refetchConversations();
          return conv.id;
        }
      } catch (err) {
        console.error("Failed to create in-app conversation", err);
      } finally {
        creatingRef.current = false;
      }
      return undefined;
    },
    [createConversationMutation, refetchConversations],
  );

  const sendMessage = useCallback(
    async (body: string) => {
      if (!selectedConversationId || !body.trim() || sendingRef.current) return null;
      sendingRef.current = true;
      try {
        const { data } = await sendMessageMutation({
          variables: { conversationId: selectedConversationId, body },
        });
        if (data) {
          setMessages((prev) => [...prev, data.sendMessage]);
          return data.sendMessage;
        }
      } catch (err) {
        console.error("Failed to send message", err);
      } finally {
        sendingRef.current = false;
      }
      return null;
    },
    [selectedConversationId, sendMessageMutation],
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

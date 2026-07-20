"use client";

import { gql } from "@apollo/client";
import { useLazyQuery, useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface InternalConversation {
  id: string;
  eventId: string;
  title: string;
  description?: string | null;
  type: "BROADCAST" | "DIRECT" | "ROLE_CHANNEL";
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  participants?: Array<{ id: string; userId: string; leftAt?: string | null }>;
}

export interface InternalParticipant {
  id: string;
  userId: string;
  leftAt?: string | null;
}

export interface InternalMessage {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  createdAt: string;
  editedAt?: string | null;
}

const LIST_CONVERSATIONS = gql`
  query InternalConversations($eventId: String!) {
    internalConversations(eventId: $eventId) {
      id
      eventId
      title
      description
      type
      createdBy
      isActive
      createdAt
      updatedAt
      participants {
        id
        userId
        leftAt
      }
    }
  }
`;

const GET_MESSAGES = gql`
  query InternalMessages($conversationId: String!, $limit: Float) {
    internalMessages(conversationId: $conversationId, limit: $limit) {
      id
      conversationId
      senderId
      body
      priority
      createdAt
      editedAt
    }
  }
`;

const CREATE_CONVERSATION = gql`
  mutation CreateInternalConversation(
    $eventId: String!
    $title: String!
    $type: InternalConversationType!
    $participantIds: [String!]
  ) {
    createInternalConversation(
      eventId: $eventId
      title: $title
      type: $type
      participantIds: $participantIds
    ) {
      id
      eventId
      title
      type
      createdBy
      isActive
      createdAt
      updatedAt
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendInternalMessage(
    $conversationId: String!
    $body: String!
    $priority: InternalMessagePriority
  ) {
    sendInternalMessage(
      conversationId: $conversationId
      body: $body
      priority: $priority
    ) {
      id
      conversationId
      senderId
      body
      priority
      createdAt
    }
  }
`;

const MARK_READ = gql`
  mutation MarkInternalConversationRead($conversationId: String!) {
    markInternalConversationRead(conversationId: $conversationId) {
      id
      conversationId
      userId
      lastReadAt
    }
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription InternalMessageReceived {
    internalMessageReceived {
      id
      conversationId
      senderId
      body
      priority
      createdAt
    }
  }
`;

export function useInternalConversation(eventId?: string, currentUserId?: string) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const directConvCache = useRef<Map<string, string>>(new Map());
  const directConvCreating = useRef<Map<string, Promise<string | undefined>>>(new Map());
  const directConvFailed = useRef<Set<string>>(new Set());
  const sendDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sendingRef = useRef(false);
  const lastMarkedIdRef = useRef<string | null>(null);
  const eventIdRef = useRef(eventId);

  // Reset all state when eventId changes
  useEffect(() => {
    if (eventId !== eventIdRef.current) {
      eventIdRef.current = eventId;
      setSelectedConversationId(null);
      directConvCache.current.clear();
      directConvFailed.current.clear();
      setMessages([]);
    }
  }, [eventId]);

  const {
    data: conversationsData,
    loading: conversationsLoading,
    refetch: refetchConversations,
  } = useQuery<{ internalConversations: InternalConversation[] }>(LIST_CONVERSATIONS, {
    variables: { eventId },
    skip: !eventId,
  });

  const conversations = conversationsData?.internalConversations ?? [];

  const [fetchMessages] = useLazyQuery<{ internalMessages: InternalMessage[] }>(GET_MESSAGES);

  const loadMessages = useCallback(
    async (conversationId: string) => {
      setMessagesLoading(true);
      try {
        const { data } = await fetchMessages({ variables: { conversationId, limit: 100 } });
        if (data) setMessages(data.internalMessages);
      } finally {
        setMessagesLoading(false);
      }
    },
    [fetchMessages],
  );

  useEffect(() => {
    if (selectedConversationId) loadMessages(selectedConversationId);
  }, [selectedConversationId, loadMessages]);

  const [createConversationMutation] = useMutation<{
    createInternalConversation: InternalConversation;
  }>(CREATE_CONVERSATION);

  const [sendMessageMutation] = useMutation<{
    sendInternalMessage: InternalMessage;
  }>(SEND_MESSAGE);

  const [markReadMutation] = useMutation(MARK_READ);

  // Subscribe to all internal messages for the current user.
  // Per-user Valkey channel ensures only the user's own conversations deliver here.
  // Client-side filtering by selectedConversationId prevents cross-talk in the UI.
  useSubscription(MESSAGE_SUBSCRIPTION, {
    skip: !currentUserId,
    onData: ({ data }) => {
      const msg = (data as { internalMessageReceived?: InternalMessage } | undefined)?.internalMessageReceived;
      if (msg && msg.conversationId === selectedConversationId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    },
  });

  const findOrCreateDirectConversation = useCallback(
    async (targetUserId: string) => {
      if (!eventId || !currentUserId) return;

      // Already successfully cached
      const cached = directConvCache.current.get(targetUserId);
      if (cached) {
        setSelectedConversationId(cached);
        return cached;
      }

      // Previously failed — do not retry automatically
      if (directConvFailed.current.has(targetUserId)) {
        return;
      }

      // Prevent concurrent duplicate creation
      const inFlight = directConvCreating.current.get(targetUserId);
      if (inFlight) {
        const id = await inFlight;
        if (id) {
          directConvCache.current.set(targetUserId, id);
          setSelectedConversationId(id);
        }
        return id;
      }

      // Always delegate to backend — it handles dedup correctly (checks participants)
      const directPromise: Promise<string | undefined> = createConversationMutation({
        variables: {
          eventId,
          title: `Direct conversation`,
          type: "DIRECT",
          participantIds: [targetUserId],
        },
      })
        .then(({ data }) => {
          if (data) {
            directConvCache.current.set(targetUserId, data.createInternalConversation.id);
            setSelectedConversationId(data.createInternalConversation.id);
            refetchConversations();
            return data.createInternalConversation.id;
          }
          return undefined;
        })
        .catch((err) => {
          console.error("Failed to create internal conversation", err);
          directConvFailed.current.add(targetUserId);
          return undefined;
        });

      directPromise.finally(() => {
        directConvCreating.current.delete(targetUserId);
      });

      directConvCreating.current.set(targetUserId, directPromise);
      const id = await directPromise;
      return id;
    },
    [eventId, currentUserId, createConversationMutation, refetchConversations],
  );

  const sendMessage = useCallback(
    async (body: string, priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT") => {
      if (!selectedConversationId || !body.trim() || sendingRef.current) return null;
      sendingRef.current = true;
      try {
        const { data } = await sendMessageMutation({
          variables: {
            conversationId: selectedConversationId,
            body,
            priority: priority ?? "NORMAL",
          },
        });
        if (data) {
          setMessages((prev) => [...prev, data.sendInternalMessage]);
          return data.sendInternalMessage;
        }
      } catch (err) {
        console.error("Failed to send internal message", err);
      } finally {
        sendingRef.current = false;
      }
      return null;
    },
    [selectedConversationId, sendMessageMutation],
  );

  const debouncedSend = useCallback(
    (body: string, priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT") => {
      if (sendDebounceRef.current) clearTimeout(sendDebounceRef.current);
      return new Promise<InternalMessage | null>((resolve) => {
        sendDebounceRef.current = setTimeout(async () => {
          const result = await sendMessage(body, priority);
          resolve(result);
        }, 300);
      });
    },
    [sendMessage],
  );

  const markAsRead = useCallback(
    async (conversationId: string) => {
      if (lastMarkedIdRef.current === conversationId) return;
      lastMarkedIdRef.current = conversationId;
      try {
        await markReadMutation({ variables: { conversationId } });
      } catch {
        // silently fail
      }
    },
    [markReadMutation],
  );

  return {
    conversations,
    conversationsLoading,
    selectedConversationId,
    messages,
    messagesLoading,
    findOrCreateDirectConversation,
    sendMessage: debouncedSend,
    markAsRead,
    loadMessages,
  };
}

"use client";

import ResolveIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { alpha, Box, CircularProgress, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import RouteGuard from "@/checkpoint/components/guard/RouteGuard";
import { useConversationUnread } from "@/checkpoint/hooks/support/useConversationUnread";
import { useEventSupport } from "@/checkpoint/hooks/support/useEventSupport";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import type { WorkspaceChannel } from "../_shared";
import {
  ConversationUnreadWatcher,
  getChannelColor,
  getChannelLabel,
  getWorkspaceTone,
  WorkspaceChannelTabs,
  WorkspaceChatHeader,
  WorkspaceChatInput,
  WorkspaceEmptyState,
  WorkspaceMessageBubble,
  WorkspacePanel,
  WorkspaceSidebar,
} from "../_shared";

const MotionBox = motion.create(Box);

function mapConversation(conv: {
  id: string;
  externalDisplayName?: string | null;
  channel: string;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  externalAddress?: string | null;
}) {
  return {
    id: conv.id,
    displayName: conv.externalDisplayName ?? "Guest",
    channel: conv.channel as WorkspaceChannel,
    lastMessage: conv.lastMessage ?? null,
    lastMessageAt: conv.lastMessageAt ?? null,
    externalAddress: conv.externalAddress ?? null,
  };
}

export default function EventSupportClientPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { id: eventId } = useParams<{ id: string }>();
  const { currentUser } = useAuth();

  const {
    conversations,
    selectedId,
    setSelectedId,
    channel,
    setChannel,
    messages,
    messagesLoading,
    fetchMessages,
    sendMessage,
  } = useEventSupport(eventId, currentUser?.id);

  const { conversations: unreadConversations, markAsRead } = useConversationUnread(eventId);

  const [unreadMap, setUnreadMap] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    setUnreadMap(new Map(unreadConversations.map((c) => [c.id, c.unreadCount ?? 0])));
  }, [unreadConversations]);

  const handleUnreadUpdate = useCallback((conversationId: string, unreadCount: number) => {
    setUnreadMap((prev) => {
      const next = new Map(prev);
      next.set(conversationId, unreadCount);
      return next;
    });
  }, []);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const tone = getWorkspaceTone(theme, channel);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedId) ?? null,
    [conversations, selectedId],
  );

  const previousChannelRef = useRef(channel);
  const hasAutoSelectedRef = useRef(false);

  useEffect(() => {
    if (channel !== previousChannelRef.current) {
      previousChannelRef.current = channel;
      setSelectedId(null);
      hasAutoSelectedRef.current = false;
      return;
    }
    if (hasAutoSelectedRef.current) return;
    const first = conversations[0];
    if (!selectedId && first) {
      hasAutoSelectedRef.current = true;
      setSelectedId(first.id);
    }
  }, [conversations, channel, selectedId, setSelectedId]);

  useEffect(() => {
    if (!selectedId) return;
    fetchMessages(selectedId);
  }, [selectedId, fetchMessages]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!selectedId || !input.trim() || sending) return;
    setSending(true);
    const body = input;
    setInput("");
    try {
      await sendMessage(selectedId, body);
    } finally {
      setSending(false);
    }
  }, [selectedId, input, sending, sendMessage]);

  const mappedConversations = useMemo(() => conversations.map(mapConversation), [conversations]);

  const headerActions = [
    {
      label: "Resolve",
      icon: <ResolveIcon sx={{ fontSize: 16 }} />,
      onClick: () => {},
    },
  ];

  if (isMobile) {
    return (
      <RouteGuard featureId="support">
        <ConversationUnreadWatcher conversationId={selectedId} onUpdate={handleUnreadUpdate} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100dvh",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <WorkspaceChannelTabs
            title="Support Center"
            subtitle="Guest support workspace"
            value={channel}
            onChange={setChannel}
          />

          {selectedId ? (
            <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 1,
                  py: 0.5,
                  borderBottom: `1px solid ${tone.divider}`,
                }}
              >
                <Box
                  component="button"
                  onClick={() => setSelectedId(null)}
                  sx={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    p: 0.5,
                    color: "text.primary",
                  }}
                >
                  <CloseIcon />
                </Box>
                <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  {selectedConversation?.externalDisplayName ?? "Conversation"}
                </Typography>
              </Box>
              {selectedConversation && (
                <WorkspaceChatHeader
                  displayName={selectedConversation.externalDisplayName ?? "Guest"}
                  channelLabel={getChannelLabel(selectedConversation.channel as WorkspaceChannel)}
                  channelColor={getChannelColor(
                    theme,
                    selectedConversation.channel as WorkspaceChannel,
                  )}
                  actions={headerActions}
                />
              )}
              <Box
                ref={messagesContainerRef}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  gap: 1,
                  overflowY: "auto",
                  px: { xs: 2, md: 3 },
                  py: 2.5,
                  backgroundColor: theme.palette.background.default,
                }}
              >
                {messagesLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress size={20} />
                  </Box>
                ) : messages.length === 0 ? (
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    <Typography sx={{ color: "text.disabled", fontSize: "0.85rem" }}>
                      No messages yet
                    </Typography>
                  </Box>
                ) : (
                  messages.map((msg) => (
                    <WorkspaceMessageBubble
                      key={msg.id}
                      body={msg.body}
                      createdAt={msg.createdAt}
                      fromAgent={msg.senderId === currentUser?.id}
                      deliveryStatus={msg.deliveryStatus}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </Box>
              <WorkspaceChatInput
                value={input}
                onChange={setInput}
                onSend={handleSend}
                sending={sending}
              />
            </Box>
          ) : (
            <WorkspaceSidebar
              channel={channel}
              selectedId={selectedId}
              conversations={mappedConversations}
              unreadMap={unreadMap}
              onSelect={setSelectedId}
              onMarkAsRead={(id) => {
                const count = unreadMap.get(id);
                if (count && count > 0) markAsRead(id);
              }}
            />
          )}
        </Box>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard featureId="support">
      <ConversationUnreadWatcher conversationId={selectedId} onUpdate={handleUnreadUpdate} />
      <Box
        sx={{
          minHeight: "100dvh",
          height: "100dvh",
          overflow: "hidden",
          backgroundColor: theme.palette.background.default,
          px: { xs: 0, md: 1.5 },
          py: { xs: 0, md: 1.5 },
        }}
      >
        <MotionBox
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          sx={{
            height: "100%",
            overflow: "hidden",
            borderRadius: { xs: 0, md: 4 },
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.72),
            backdropFilter: "blur(20px) saturate(150%)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <WorkspaceChannelTabs
            title="Support Center"
            subtitle="Guest support workspace"
            value={channel}
            onChange={setChannel}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              flex: 1,
              minHeight: 0,
            }}
          >
            <WorkspaceSidebar
              channel={channel}
              selectedId={selectedId}
              conversations={mappedConversations}
              unreadMap={unreadMap}
              onSelect={setSelectedId}
              onMarkAsRead={(id) => {
                const count = unreadMap.get(id);
                if (count && count > 0) markAsRead(id);
              }}
            />

            <WorkspacePanel panelKey={`${channel}-${selectedId}`}>
              {selectedId ? (
                <>
                  {selectedConversation && (
                    <WorkspaceChatHeader
                      displayName={selectedConversation.externalDisplayName ?? "Guest"}
                      channelLabel={getChannelLabel(
                        selectedConversation.channel as WorkspaceChannel,
                      )}
                      channelColor={getChannelColor(
                        theme,
                        selectedConversation.channel as WorkspaceChannel,
                      )}
                      actions={headerActions}
                    />
                  )}
                  <Box
                    ref={messagesContainerRef}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      gap: 1,
                      overflowY: "auto",
                      px: { xs: 2, md: 3 },
                      py: 2.5,
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    {messagesLoading ? (
                      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress size={20} />
                      </Box>
                    ) : messages.length === 0 ? (
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                          flex: 1,
                          justifyContent: "center",
                        }}
                      >
                        <Typography sx={{ color: "text.disabled", fontSize: "0.85rem" }}>
                          No messages yet
                        </Typography>
                      </Box>
                    ) : (
                      messages.map((msg) => (
                        <WorkspaceMessageBubble
                          key={msg.id}
                          body={msg.body}
                          createdAt={msg.createdAt}
                          fromAgent={msg.senderId === currentUser?.id}
                          deliveryStatus={msg.deliveryStatus}
                        />
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </Box>
                  <WorkspaceChatInput
                    value={input}
                    onChange={setInput}
                    onSend={handleSend}
                    sending={sending}
                  />
                </>
              ) : (
                <WorkspaceEmptyState />
              )}
            </WorkspacePanel>
          </Box>
        </MotionBox>
      </Box>
    </RouteGuard>
  );
}

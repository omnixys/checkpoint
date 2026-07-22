"use client";

import {
  alpha,
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputBase,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Close,
  Group as GroupIcon,
  Send as SendIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { List as VList } from "react-window";
import RouteGuard from "@/checkpoint/components/guard/RouteGuard";
import { useEventSupport } from "@/checkpoint/hooks/support/useEventSupport";
import type { Conversation, Message } from "@/checkpoint/hooks/support/useEventSupport";
import { useConversationUnread, useConversationUnreadSubscription } from "@/checkpoint/hooks/support/useConversationUnread";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import QuickReplyManager from "@/checkpoint/components/support/quick-replies/QuickReplyManager";
import QuickReplyPicker from "@/checkpoint/components/support/quick-replies/QuickReplyPicker";
import { SupportGuestSidebar } from "./SupportGuestSidebar";

type TabValue = "unassigned" | "assigned";

function channelIcon(channel: string) {
  return channel === "WHATSAPP" ? "📱" : channel === "IN_APP" ? "💬" : "✉️";
}

function ConversationListItem({
  conversation,
  selected,
  unreadCount,
  onClick,
}: {
  conversation: Conversation;
  selected: boolean;
  unreadCount?: number | null;
  onClick: () => void;
}) {
  const theme = useTheme();
  const displayName = conversation.externalDisplayName ?? "Guest";

  return (
    <ListItemButton
      onClick={onClick}
      selected={selected}
      sx={{
        borderRadius: 2,
        mb: 0.5,
        mx: 1,
        opacity: selected || !unreadCount ? 1 : 0.85,
        ...(selected && {
          bgcolor: alpha(theme.palette.primary.main, 0.08),
        }),
      }}
    >
      <ListItemAvatar>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          badgeContent={unreadCount && unreadCount > 0 ? unreadCount : 0}
          color="error"
          invisible={!unreadCount || unreadCount === 0}
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.6rem",
              height: 18,
              minWidth: 18,
              lineHeight: "18px",
              fontWeight: 700,
            },
          }}
        >
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              width: 40,
              height: 40,
              ...(unreadCount && unreadCount > 0 && {
                boxShadow: `0 0 0 2px ${theme.palette.error.main}`,
              }),
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
        </Badge>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography
              noWrap
              sx={{ flex: 1, fontSize: "0.85rem", fontWeight: selected ? 700 : 500 }}
            >
              {displayName}
            </Typography>
            <Typography sx={{ color: "text.disabled", fontSize: "0.65rem", flexShrink: 0 }}>
              {conversation.lastMessageAt
                ? new Date(conversation.lastMessageAt).toLocaleDateString()
                : ""}
            </Typography>
          </Stack>
        }
        secondary={
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", mt: 0.3 }}>
            <Typography
              noWrap
              sx={{
                color: "text.disabled",
                flex: 1,
                fontSize: "0.75rem",
                fontWeight: unreadCount && unreadCount > 0 ? 600 : 400,
              }}
            >
              {conversation.lastMessage ?? "No messages yet"}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem" }}>
              {channelIcon(conversation.channel)}
            </Typography>
          </Stack>
        }
        sx={{ my: 0 }}
      />
    </ListItemButton>
  );
}

function MessageBubble({ message, currentUserId }: { message: Message; currentUserId?: string | undefined }) {
  const theme = useTheme();
  const fromAgent = message.senderId === currentUserId;

  return (
    <Box
      sx={{
        alignSelf: fromAgent ? "flex-end" : "flex-start",
        maxWidth: "78%",
      }}
    >
      <Box
        sx={{
          background: fromAgent
            ? alpha(theme.palette.primary.main, 0.12)
            : alpha(theme.palette.background.paper, 0.6),
          border: "1px solid",
          borderColor: fromAgent
            ? alpha(theme.palette.primary.main, 0.18)
            : alpha(theme.palette.divider, 0.12),
          borderRadius: fromAgent ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          px: 2,
          py: 1.2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.85rem",
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {message.body}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "text.disabled",
            display: "block",
            fontSize: "0.6rem",
            mt: 0.2,
            textAlign: fromAgent ? "right" : "left",
          }}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </Box>
    </Box>
  );
}

function ConversationUnreadWatcher({
  conversationId,
  onUpdate,
}: {
  conversationId: string | null;
  onUpdate: (conversationId: string, unreadCount: number) => void;
}) {
  const { unreadUpdate } = useConversationUnreadSubscription(conversationId);
  useEffect(() => {
    if (unreadUpdate) onUpdate(unreadUpdate.conversationId, unreadUpdate.unreadCount);
  }, [unreadUpdate, onUpdate]);
  return null;
}

export default function EventSupportClientPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const { id: eventId } = useParams<{ id: string }>();
  const { currentUser } = useAuth();

  const {
    unassigned,
    unassignedLoading,
    assigned,
    assignedLoading,
    fetchMessages,
    sendMessage,
    createConversation,
  } = useEventSupport(eventId, currentUser?.id);

  const {
    conversations: unreadConversations,
    markAsRead,
  } = useConversationUnread(eventId);

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

  const [tab, setTab] = useState<TabValue>("unassigned");
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [selectedGuestName, setSelectedGuestName] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showGuests, setShowGuests] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [quickReplyManagerOpen, setQuickReplyManagerOpen] = useState(false);
  const [newConvInput, setNewConvInput] = useState("");
  const [showNewConvInput, setShowNewConvInput] = useState(false);
  const [creatingConversation, setCreatingConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const listContainerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(600);

  useEffect(() => {
    const el = listContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setListHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const CONVERSATION_ITEM_HEIGHT = 72;

  const listItems = tab === "unassigned" ? unassigned : assigned;
  const loading = tab === "unassigned" ? unassignedLoading : assignedLoading;

  const selectedConversation = [...unassigned, ...assigned].find(
    (c) => c.id === selectedId,
  );

  const filteredConversations = listItems;

  useEffect(() => {
    if (!selectedId) return;
    setMessagesLoading(true);
    fetchMessages(selectedId)
      .then(setMessages)
      .finally(() => setMessagesLoading(false));
  }, [selectedId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!selectedId || !input.trim() || sending) return;
    setSending(true);
    const body = input;
    setInput("");
    try {
      const msg = await sendMessage(selectedId, body);
      if (msg) setMessages((prev) => [...prev, msg]);
    } finally {
      setSending(false);
    }
  }, [selectedId, input, sending, sendMessage]);

  const handleCreateWhatsApp = useCallback(async () => {
    if (!selectedGuestName || !newConvInput.trim() || creatingConversation) return;
    setCreatingConversation(true);
    try {
      const conv = await createConversation(selectedGuestName, newConvInput.trim(), "WHATSAPP");
      if (conv) {
        setSelectedId(conv.id);
        setNewConvInput("");
        setShowNewConvInput(false);
      }
    } finally {
      setCreatingConversation(false);
    }
  }, [selectedGuestName, newConvInput, creatingConversation, createConversation]);

  const queuePanel = (
    <Box
      sx={{
        borderRight: isMobile ? "none" : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: isMobile ? "100%" : 340,
        flexShrink: 0,
      }}
    >
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {isTablet && !showGuests && (
              <IconButton size="small" onClick={() => setShowGuests(true)} title="Show guests">
                <GroupIcon fontSize="small" />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
              Support Queue
            </Typography>
          </Stack>
          <IconButton size="small" onClick={() => setQuickReplyManagerOpen(true)} title="Manage quick replies">
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
      <Tabs
        value={tab}
        onChange={(_, v) => { setTab(v); setSelectedId(null); setMessages([]); }}
        sx={{ px: 2 }}
      >
        <Tab
          label={`Unassigned (${unassigned.length})`}
          value="unassigned"
          sx={{ fontSize: "0.75rem", minHeight: 36, textTransform: "none" }}
        />
        <Tab
          label={`Assigned (${assigned.length})`}
          value="assigned"
          sx={{ fontSize: "0.75rem", minHeight: 36, textTransform: "none" }}
        />
      </Tabs>
      {selectedGuestId && (
        <Box sx={{ px: 2, pb: 1, pt: 1 }}>
          <Stack spacing={1}>
            {!showNewConvInput && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<ChatIcon sx={{ fontSize: 16 }} />}
                disabled={!selectedGuestId || creatingConversation}
                onClick={() => setShowNewConvInput(true)}
                sx={{ fontSize: "0.7rem", textTransform: "none" }}
              >
                New WhatsApp
              </Button>
            )}
            {showNewConvInput && (
              <Stack direction="row" spacing={0.5}>
                <InputBase
                  value={newConvInput}
                  onChange={(e) => setNewConvInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleCreateWhatsApp();
                    }
                    if (e.key === "Escape") {
                      setShowNewConvInput(false);
                      setNewConvInput("");
                    }
                  }}
                  placeholder="First message to guest..."
                  autoFocus
                  sx={{
                    flex: 1,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: "0.75rem",
                    bgcolor: alpha(theme.palette.action.hover, 0.3),
                    border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                  }}
                />
                <IconButton
                  size="small"
                  disabled={!newConvInput.trim() || creatingConversation}
                  onClick={handleCreateWhatsApp}
                  sx={{ color: "primary.main" }}
                >
                  <SendIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Stack>
            )}
          </Stack>
        </Box>
      )}
      <Box ref={listContainerRef} sx={{ flex: 1, overflow: "hidden", py: 1 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : filteredConversations.length === 0 ? (
          <Typography
            sx={{ color: "text.disabled", fontSize: "0.8rem", py: 4, textAlign: "center" }}
          >
            {selectedGuestId ? "No conversations with this guest" : tab === "unassigned" ? "No unassigned conversations" : "No assigned conversations"}
          </Typography>
        ) : (
          <VList
            style={{ height: listHeight, width: "100%" }}
            rowCount={filteredConversations.length}
            rowHeight={CONVERSATION_ITEM_HEIGHT}
            overscanCount={5}
            rowProps={{}}
            rowComponent={({ index, style }) => {
              const conv = filteredConversations[index];
              if (!conv) return null;
              return (
                <div style={style}>
                  <ConversationListItem
                    conversation={conv}
                    selected={selectedId === conv.id}
                    unreadCount={unreadMap.get(conv.id) ?? null}
                    onClick={() => {
                      setSelectedId(conv.id);
                      const count = unreadMap.get(conv.id);
                      if (count && count > 0) markAsRead(conv.id);
                    }}
                  />
                </div>
              );
            }}
          />
        )}
      </Box>
    </Box>
  );

  const detailPanel = !selectedConversation ? (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Typography sx={{ color: "text.disabled", fontSize: "0.9rem" }}>
        Select a conversation to view
      </Typography>
    </Box>
  ) : (
    <Box sx={{ display: "flex", flex: 1, flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          alignItems: "center",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: "flex",
          gap: 1.5,
          px: 2,
          py: 1.5,
        }}
      >
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: "primary.main",
            width: 36,
            height: 36,
            fontSize: "0.9rem",
          }}
        >
          {(selectedConversation.externalDisplayName ?? "Guest").charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>
            {selectedConversation.externalDisplayName ?? "Guest"}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
            {selectedConversation.channel}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: 1,
          overflowY: "auto",
          px: 2,
          py: 1.5,
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
            <Typography sx={{ color: "text.disabled", fontSize: "0.8rem" }}>
              No messages yet
            </Typography>
          </Box>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} currentUserId={currentUser?.id} />)
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        sx={{
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          px: 2,
          py: 1.5,
        }}
      >
        <Stack direction="row" spacing={1}>
          <InputBase
            disabled={sending}
            multiline
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Reply as agent..."
            maxRows={4}
            value={input}
            sx={{
              bgcolor: alpha(theme.palette.action.hover, 0.3),
              borderRadius: 2,
              flex: 1,
              fontSize: "0.85rem",
              px: 1.5,
              py: 1,
            }}
          />
          <QuickReplyPicker onSelect={(body) => setInput((prev) => prev + body)} />
          <IconButton
            color="primary"
            disabled={!input.trim() || sending}
            onClick={handleSend}
            size="small"
            sx={{ alignSelf: "flex-end" }}
          >
            <SendIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <>
      <RouteGuard featureId="support">
      <ConversationUnreadWatcher conversationId={selectedId} onUpdate={handleUnreadUpdate} />
      <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 160px)", width: "100%", maxWidth: 700, mx: "auto" }}>
        {selectedGuestId && !selectedId ? (
          <>
            <Box sx={{ display: "flex", alignItems: "center", px: 1, py: 0.5 }}>
              <IconButton onClick={() => setSelectedGuestId(null)}>
                <Close />
              </IconButton>
              <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                Conversations
              </Typography>
            </Box>
            {queuePanel}
          </>
        ) : selectedId ? (
          <>
            <Box sx={{ display: "flex", alignItems: "center", px: 1, py: 0.5 }}>
              <IconButton onClick={() => { setSelectedId(null); setMessages([]); }}>
                <Close />
              </IconButton>
              <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                {selectedConversation?.externalDisplayName ?? "Conversation"}
              </Typography>
            </Box>
            {detailPanel}
          </>
        ) : (
          <Box sx={{ display: "flex", flex: 1 }}>
            <Box sx={{ width: "100%" }}>
              <SupportGuestSidebar
                eventId={eventId}
                selectedGuestId={selectedGuestId}
                onSelect={(id, name) => {
                  setSelectedGuestId(id);
                  setSelectedGuestName(name);
                }}
              />
            </Box>
          </Box>
        )}
        <QuickReplyManager
          open={quickReplyManagerOpen}
          onClose={() => setQuickReplyManagerOpen(false)}
        />
      </Box>
      </RouteGuard>
    </>
    );
  }

  return (
    <>
    <RouteGuard featureId="support">
    <ConversationUnreadWatcher conversationId={selectedId} onUpdate={handleUnreadUpdate} />
    <Box
      sx={{
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: 3,
        display: "flex",
        height: "calc(100dvh - 200px)",
        maxWidth: 1200,
        mx: "auto",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {isTablet && !showGuests ? null : (
        <Box sx={{ width: isTablet ? 240 : 280, flexShrink: 0 }}>
          <SupportGuestSidebar
            eventId={eventId}
            selectedGuestId={selectedGuestId}
            onSelect={(id, name) => {
              setSelectedGuestId(id);
              setSelectedGuestName(name);
              setSelectedId(null);
              setMessages([]);
              if (isTablet) setShowGuests(false);
            }}
          />
        </Box>
      )}
      {queuePanel}
      <Box sx={{ display: "flex", flex: 1 }}>{detailPanel}</Box>
      <QuickReplyManager
        open={quickReplyManagerOpen}
        onClose={() => setQuickReplyManagerOpen(false)}
      />
    </Box>
    </RouteGuard>
    </>
  );
}

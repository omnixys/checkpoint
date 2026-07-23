"use client";

import {
  AssignmentInd as AssignIcon,
  Chat as ChatIcon,
  Close,
  MoreVert as MoreIcon,
  CheckCircle as ResolveIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import {
  Avatar,
  alpha,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { List as VList } from "react-window";
import RouteGuard from "@/checkpoint/components/guard/RouteGuard";
import {
  useConversationUnread,
  useConversationUnreadSubscription,
} from "@/checkpoint/hooks/support/useConversationUnread";
import type { Conversation, Message } from "@/checkpoint/hooks/support/useEventSupport";
import { useEventSupport } from "@/checkpoint/hooks/support/useEventSupport";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { SupportGuestSidebar } from "./SupportGuestSidebar";

type TabValue = "unassigned" | "assigned" | "closed";

function channelBadge(channel: string) {
  switch (channel) {
    case "WHATSAPP":
      return { label: "WhatsApp", color: "#25D366" as const };
    case "IN_APP":
      return { label: "In-App", color: undefined };
    default:
      return { label: channel, color: undefined };
  }
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
  const badge = channelBadge(conversation.channel);

  return (
    <Box
      onClick={onClick}
      sx={{
        borderRadius: 2,
        cursor: "pointer",
        mx: 1,
        mb: 0.5,
        p: 1.5,
        transition: "background 0.15s",
        ...(selected && {
          bgcolor: alpha(theme.palette.primary.main, 0.08),
        }),
        ...(!selected && {
          "&:hover": {
            bgcolor:
              theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.04) : alpha("#000000", 0.03),
          },
        }),
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
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
              fontSize: "0.85rem",
              fontWeight: 700,
              ...(unreadCount &&
                unreadCount > 0 && {
                  boxShadow: `0 0 0 2px ${theme.palette.error.main}`,
                }),
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
        </Badge>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography
              noWrap
              sx={{
                flex: 1,
                fontSize: "0.85rem",
                fontWeight: unreadCount && unreadCount > 0 ? 700 : 500,
              }}
            >
              {displayName}
            </Typography>
            <Typography sx={{ color: "text.disabled", fontSize: "0.65rem", flexShrink: 0 }}>
              {conversation.lastMessageAt ? formatRelativeTime(conversation.lastMessageAt) : ""}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", mt: 0.25 }}>
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
            {badge.color ? (
              <Chip
                label={badge.label}
                size="small"
                sx={{
                  height: 14,
                  fontSize: "0.55rem",
                  fontWeight: 600,
                  bgcolor: alpha(badge.color, 0.1),
                  color: badge.color,
                  "& .MuiChip-label": { px: 0.5 },
                }}
              />
            ) : (
              <Typography sx={{ fontSize: "0.65rem", color: "text.disabled" }}>
                {badge.label}
              </Typography>
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

function MessageBubble({
  message,
  currentUserId,
}: {
  message: Message;
  currentUserId?: string | undefined;
}) {
  const theme = useTheme();
  const fromAgent = message.senderId === currentUserId;

  return (
    <Box
      sx={{
        alignSelf: fromAgent ? "flex-end" : "flex-start",
        maxWidth: "78%",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          background: fromAgent
            ? alpha(theme.palette.primary.main, 0.12)
            : alpha(theme.palette.background.paper, 0.6),
          border: "1px solid",
          borderColor: fromAgent
            ? alpha(theme.palette.primary.main, 0.18)
            : alpha(theme.palette.divider, 0.12),
          borderRadius: fromAgent ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          px: 2.5,
          py: 1.5,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.875rem",
            lineHeight: 1.6,
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
            fontSize: "0.65rem",
            mt: 0.5,
            textAlign: fromAgent ? "right" : "left",
          }}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {fromAgent && message.deliveryStatus && (
            <Box component="span" sx={{ ml: 0.5 }}>
              {message.deliveryStatus === "READ"
                ? "✓✓"
                : message.deliveryStatus === "DELIVERED"
                  ? "✓✓"
                  : message.deliveryStatus === "SENT"
                    ? "✓"
                    : ""}
            </Box>
          )}
        </Typography>
      </Paper>
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

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
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
    selectedId,
    setSelectedId,
    messages,
    messagesLoading,
    fetchMessages,
    sendMessage,
    createConversation,
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

  const [tab, setTab] = useState<TabValue>("unassigned");
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [selectedGuestName, setSelectedGuestName] = useState<string | null>(null);
  const [selectedGuestPhone, setSelectedGuestPhone] = useState<string | null>(null);
  const [showGuests, setShowGuests] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [newConvInput, setNewConvInput] = useState("");
  const [showNewConvInput, setShowNewConvInput] = useState(false);
  const [creatingConversation, setCreatingConversation] = useState(false);
  const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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

  const CONVERSATION_ITEM_HEIGHT = 76;

  const allConversations = [...unassigned, ...assigned];
  const listItems = tab === "unassigned" ? unassigned : tab === "assigned" ? assigned : [];
  const loading =
    tab === "unassigned" ? unassignedLoading : tab === "assigned" ? assignedLoading : false;

  const selectedConversation = allConversations.find((c) => c.id === selectedId);

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

  const handleCreateWhatsApp = useCallback(async () => {
    if (!selectedGuestName || !newConvInput.trim() || creatingConversation) return;
    setCreatingConversation(true);
    try {
      const conv = await createConversation(
        selectedGuestName,
        newConvInput.trim(),
        "WHATSAPP",
        selectedGuestPhone ?? undefined,
      );
      if (conv) {
        setSelectedId(conv.id);
        setNewConvInput("");
        setShowNewConvInput(false);
      }
    } finally {
      setCreatingConversation(false);
    }
  }, [
    selectedGuestName,
    selectedGuestPhone,
    newConvInput,
    creatingConversation,
    createConversation,
    setSelectedId,
  ]);

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
                <AssignIcon fontSize="small" />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
              Support Queue
            </Typography>
          </Stack>
        </Stack>
      </Box>
      <Tabs
        value={tab}
        onChange={(_, v) => {
          setTab(v);
          setSelectedId(null);
        }}
        sx={{ px: 1 }}
      >
        <Tab
          label={`Unassigned (${unassigned.length})`}
          value="unassigned"
          sx={{ fontSize: "0.72rem", minHeight: 36, textTransform: "none" }}
        />
        <Tab
          label={`Assigned (${assigned.length})`}
          value="assigned"
          sx={{ fontSize: "0.72rem", minHeight: 36, textTransform: "none" }}
        />
      </Tabs>
      {selectedGuestId && (
        <Box sx={{ px: 2, pb: 1, pt: 1 }}>
          <Stack spacing={1}>
            {!showNewConvInput && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<ChatIcon sx={{ fontSize: 14 }} />}
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
      <Box ref={listContainerRef} sx={{ flex: 1, overflow: "hidden", py: 0.5 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : listItems.length === 0 ? (
          <Typography
            sx={{ color: "text.disabled", fontSize: "0.8rem", py: 4, textAlign: "center", px: 2 }}
          >
            {selectedGuestId
              ? "No conversations with this guest"
              : tab === "unassigned"
                ? "No unassigned conversations"
                : "No assigned conversations"}
          </Typography>
        ) : (
          <VList
            style={{ height: listHeight, width: "100%" }}
            rowCount={listItems.length}
            rowHeight={CONVERSATION_ITEM_HEIGHT}
            overscanCount={5}
            rowProps={{}}
            rowComponent={({ index, style }) => {
              const conv = listItems[index];
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

  const emptyState = (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        flex: 1,
        flexDirection: "column",
        gap: 2,
        justifyContent: "center",
        px: 4,
      }}
    >
      <Avatar
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          color: "primary.main",
          height: 64,
          width: 64,
        }}
      >
        <ChatIcon sx={{ fontSize: 32 }} />
      </Avatar>
      <Typography sx={{ color: "text.primary", fontSize: "1rem", fontWeight: 600 }}>
        Select a conversation
      </Typography>
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: "0.85rem",
          lineHeight: 1.6,
          maxWidth: 320,
          textAlign: "center",
        }}
      >
        Choose a guest from the sidebar to view their conversations and respond to messages.
      </Typography>
    </Box>
  );

  const detailPanel = !selectedConversation ? (
    emptyState
  ) : (
    <Box sx={{ display: "flex", flex: 1, flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          alignItems: "center",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: "flex",
          gap: 1.5,
          px: 2.5,
          py: 1.5,
        }}
      >
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: "primary.main",
            width: 40,
            height: 40,
            fontSize: "0.95rem",
            fontWeight: 700,
          }}
        >
          {(selectedConversation.externalDisplayName ?? "Guest").charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 600 }}>
            {selectedConversation.externalDisplayName ?? "Guest"}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 0.25 }}>
            {(() => {
              const badge = channelBadge(selectedConversation.channel);
              return badge.color ? (
                <Chip
                  label={badge.label}
                  size="small"
                  sx={{
                    height: 16,
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    bgcolor: alpha(badge.color, 0.1),
                    color: badge.color,
                    "& .MuiChip-label": { px: 0.5 },
                  }}
                />
              ) : (
                <Typography sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                  {badge.label}
                </Typography>
              );
            })()}
            <Typography sx={{ color: "text.secondary", fontSize: "0.7rem" }}>Online</Typography>
          </Stack>
        </Box>
        <IconButton size="small" onClick={(e) => setMoreAnchor(e.currentTarget)}>
          <MoreIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={moreAnchor} open={Boolean(moreAnchor)} onClose={() => setMoreAnchor(null)}>
          <MenuItem onClick={() => setMoreAnchor(null)}>
            <AssignIcon sx={{ mr: 1, fontSize: 16 }} /> Assign to me
          </MenuItem>
          <MenuItem onClick={() => setMoreAnchor(null)}>
            <ResolveIcon sx={{ mr: 1, fontSize: 16 }} /> Resolve
          </MenuItem>
        </Menu>
      </Box>

      <Box
        ref={messagesContainerRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: 1.5,
          overflowY: "auto",
          px: 2.5,
          py: 2,
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: alpha(theme.palette.text.primary, 0.08),
            borderRadius: 4,
          },
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
            <MessageBubble key={msg.id} message={msg} currentUserId={currentUser?.id} />
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        sx={{
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: "flex",
          gap: 1,
          p: 1.5,
        }}
      >
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
        <IconButton
          color="primary"
          disabled={!input.trim() || sending}
          onClick={handleSend}
          size="small"
          sx={{ alignSelf: "flex-end" }}
        >
          <SendIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <RouteGuard featureId="support">
        <ConversationUnreadWatcher conversationId={selectedId} onUpdate={handleUnreadUpdate} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100dvh - 160px)",
            width: "100%",
            maxWidth: 700,
            mx: "auto",
          }}
        >
          {selectedGuestId && !selectedId ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center", px: 1, py: 0.5 }}>
                <IconButton
                  onClick={() => {
                    setSelectedGuestId(null);
                    setSelectedGuestName(null);
                    setSelectedGuestPhone(null);
                  }}
                >
                  <Close />
                </IconButton>
                <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>Conversations</Typography>
              </Box>
              {queuePanel}
            </>
          ) : selectedId ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center", px: 1, py: 0.5 }}>
                <IconButton
                  onClick={() => {
                    setSelectedId(null);
                  }}
                >
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
                  onSelect={(id, name, phone) => {
                    setSelectedGuestId(id);
                    setSelectedGuestName(name);
                    setSelectedGuestPhone(phone ?? null);
                  }}
                />
              </Box>
            </Box>
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
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3,
          display: "flex",
          height: "calc(100dvh - 200px)",
          maxWidth: 1400,
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
              onSelect={(id, name, phone) => {
                setSelectedGuestId(id);
                setSelectedGuestName(name);
                setSelectedGuestPhone(phone ?? null);
                setSelectedId(null);
                if (isTablet) setShowGuests(false);
              }}
            />
          </Box>
        )}
        {queuePanel}
        <Box sx={{ display: "flex", flex: 1 }}>{detailPanel}</Box>
      </Box>
    </RouteGuard>
  );
}

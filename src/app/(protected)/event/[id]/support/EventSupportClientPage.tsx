"use client";

import {
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
  Chip,
  CircularProgress,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

type FilterValue = "all" | "whatsapp" | "inapp";

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
                ? "\u2713\u2713"
                : message.deliveryStatus === "DELIVERED"
                  ? "\u2713\u2713"
                  : message.deliveryStatus === "SENT"
                    ? "\u2713"
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

function FilterChipGroup({
  value,
  onChange,
  counts,
}: {
  value: FilterValue;
  onChange: (v: FilterValue) => void;
  counts: { all: number; whatsapp: number; inapp: number };
}) {
  const theme = useTheme();
  const filters: { key: FilterValue; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "whatsapp", label: "WhatsApp", count: counts.whatsapp },
    { key: "inapp", label: "In-App", count: counts.inapp },
  ];

  return (
    <Stack direction="row" spacing={0.5}>
      {filters.map((f) => (
        <Chip
          key={f.key}
          label={`${f.label} (${f.count})`}
          size="small"
          onClick={() => onChange(f.key)}
          sx={{
            height: 26,
            fontSize: "0.72rem",
            fontWeight: value === f.key ? 700 : 500,
            bgcolor:
              value === f.key
                ? alpha(theme.palette.primary.main, 0.12)
                : alpha(theme.palette.action.hover, 0.4),
            color: value === f.key ? "primary.main" : "text.secondary",
            border: "1px solid",
            borderColor:
              value === f.key
                ? alpha(theme.palette.primary.main, 0.24)
                : alpha(theme.palette.divider, 0.12),
            cursor: "pointer",
            "&:hover": {
              bgcolor:
                value === f.key
                  ? alpha(theme.palette.primary.main, 0.16)
                  : alpha(theme.palette.action.hover, 0.6),
            },
          }}
        />
      ))}
    </Stack>
  );
}

const CONVERSATION_ITEM_HEIGHT = 76;

export default function EventSupportClientPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { id: eventId } = useParams<{ id: string }>();
  const { currentUser } = useAuth();

  const {
    conversations,
    conversationsLoading,
    selectedId,
    setSelectedId,
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

  const [filter, setFilter] = useState<FilterValue>("all");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
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

  const filterCounts = useMemo(() => {
    const all = conversations.length;
    const whatsapp = conversations.filter((c) => c.channel === "WHATSAPP").length;
    return { all, whatsapp, inapp: all - whatsapp };
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    if (filter === "all") return conversations;
    if (filter === "whatsapp") return conversations.filter((c) => c.channel === "WHATSAPP");
    return conversations.filter((c) => c.channel !== "WHATSAPP");
  }, [conversations, filter]);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedId) ?? null,
    [conversations, selectedId],
  );

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

  const conversationList = (
    <Box ref={listContainerRef} sx={{ flex: 1, overflow: "hidden" }}>
      {conversationsLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : filteredConversations.length === 0 ? (
        <Typography
          sx={{ color: "text.disabled", fontSize: "0.8rem", py: 4, textAlign: "center", px: 2 }}
        >
          No conversations found
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
  );

  const chatHeader = selectedConversation ? (
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
          <ResolveIcon sx={{ mr: 1, fontSize: 16 }} /> Resolve
        </MenuItem>
      </Menu>
    </Box>
  ) : null;

  const chatMessages = (
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
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.5)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
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
  );

  const chatInput = (
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
          fontSize: "0.875rem",
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
            mx: "auto",
          }}
        >
          {selectedId ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center", px: 1, py: 0.5 }}>
                <IconButton onClick={() => setSelectedId(null)}>
                  <Close />
                </IconButton>
                <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  {selectedConversation?.externalDisplayName ?? "Conversation"}
                </Typography>
              </Box>
              {chatHeader}
              {chatMessages}
              {chatInput}
            </>
          ) : (
            <>
              <Box sx={{ px: 2, pt: 2, pb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  Conversations
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <FilterChipGroup value={filter} onChange={setFilter} counts={filterCounts} />
                </Box>
              </Box>
              {conversationList}
            </>
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
        <Box
          sx={{
            width: 300,
            flexShrink: 0,
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <SupportGuestSidebar eventId={eventId} selectedGuestId={null} onSelect={() => {}} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              px: 2,
              pt: 1.5,
              pb: 1,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                {selectedConversation
                  ? `${selectedConversation.externalDisplayName ?? "Guest"}`
                  : "Conversations"}
              </Typography>
              {!selectedConversation && (
                <FilterChipGroup value={filter} onChange={setFilter} counts={filterCounts} />
              )}
            </Stack>
          </Box>
          {selectedConversation ? (
            <>
              {chatHeader}
              {chatMessages}
              {chatInput}
            </>
          ) : (
            conversationList
          )}
        </Box>
      </Box>
    </RouteGuard>
  );
}

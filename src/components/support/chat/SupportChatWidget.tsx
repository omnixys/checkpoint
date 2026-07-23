"use client";

import type { Message } from "@/checkpoint/generated/graphql";
import type { PendingMessage } from "@/checkpoint/hooks/support/useSupportChat";

type SupportMessage = Message;

import { ArrowDownward, Chat, Close, RefreshOutlined, Send as SendIcon } from "@mui/icons-material";
import {
  Avatar,
  alpha,
  Box,
  CircularProgress,
  Fab,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

interface SupportChatWidgetProps {
  messages: SupportMessage[];
  pendingMessages?: PendingMessage[];
  latestMessage: SupportMessage | null;
  onSend: (body: string) => Promise<void>;
  onRetry?: (pending: PendingMessage) => Promise<void>;
  sending: boolean;
  isCreating?: boolean;
  guestName?: string;
  currentUserId?: string;
  messagesLoading?: boolean;
}

function ChatBubble({
  message,
  isLatest,
  currentUserId,
}: {
  message: SupportMessage;
  isLatest: boolean;
  currentUserId?: string | undefined;
}) {
  const theme = useTheme();
  const isGuest = currentUserId ? message.senderId === currentUserId : false;

  return (
    <motion.div
      initial={isLatest ? { opacity: 0, y: 8, scale: 0.96 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        alignSelf: isGuest ? "flex-end" : "flex-start",
        maxWidth: "82%",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          background: isGuest
            ? alpha(theme.palette.primary.main, 0.12)
            : alpha(theme.palette.background.paper, 0.6),
          border: "1px solid",
          borderColor: isGuest
            ? alpha(theme.palette.primary.main, 0.18)
            : alpha(theme.palette.divider, 0.12),
          borderRadius: isGuest ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          px: 2.5,
          py: 1.5,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "text.primary",
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
            textAlign: isGuest ? "right" : "left",
          }}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </Paper>
    </motion.div>
  );
}

function PendingBubble({
  pending,
  onRetry,
}: {
  pending: PendingMessage;
  onRetry?: (pending: PendingMessage) => Promise<void>;
}) {
  const theme = useTheme();
  const isFailed = pending.status === "failed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.15 }}
      style={{ alignSelf: "flex-end", maxWidth: "82%" }}
    >
      <Paper
        elevation={0}
        sx={{
          background: isFailed
            ? alpha(theme.palette.error.main, 0.08)
            : alpha(theme.palette.primary.main, 0.08),
          border: "1px solid",
          borderColor: isFailed
            ? alpha(theme.palette.error.main, 0.18)
            : alpha(theme.palette.primary.main, 0.12),
          borderRadius: "18px 18px 4px 18px",
          px: 2.5,
          py: 1.5,
          opacity: pending.status === "sending" ? 0.7 : 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "text.primary",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {pending.body}
        </Typography>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            gap: 0.5,
            justifyContent: "flex-end",
            mt: 0.5,
          }}
        >
          {pending.status === "sending" && (
            <CircularProgress size={10} sx={{ color: "text.disabled" }} />
          )}
          {isFailed && onRetry && (
            <Tooltip title="Retry">
              <IconButton
                onClick={() => onRetry(pending)}
                size="small"
                sx={{ color: "error.main", p: 0, mr: 0.5 }}
              >
                <RefreshOutlined sx={{ fontSize: 12 }} />
              </IconButton>
            </Tooltip>
          )}
          <Typography
            variant="caption"
            sx={{
              color: isFailed ? "error.main" : "text.disabled",
              fontSize: "0.65rem",
            }}
          >
            {isFailed ? "Failed" : "Sending..."}
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Avatar
        sx={{
          bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
          color: "primary.main",
          height: 56,
          width: 56,
        }}
      >
        <Chat sx={{ fontSize: 28 }} />
      </Avatar>
      <Typography
        sx={{
          color: "text.primary",
          fontSize: "0.95rem",
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        Need help?
      </Typography>
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: "0.8rem",
          lineHeight: 1.6,
          maxWidth: 260,
          textAlign: "center",
        }}
      >
        Describe your issue and we&apos;ll connect you with our support team.
      </Typography>
    </Box>
  );
}

export default function SupportChatWidget({
  messages,
  pendingMessages = [],
  latestMessage,
  onSend,
  onRetry,
  sending,
  isCreating = false,
  guestName,
  currentUserId,
  messagesLoading = false,
}: SupportChatWidgetProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollToBottom = useCallback(
    (force = false) => {
      if (!listRef.current) return;
      if (!autoScroll && !force) return;
      listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    },
    [autoScroll],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on any message change
  useEffect(() => {
    scrollToBottom();
  }, [messages, latestMessage, pendingMessages, scrollToBottom]);

  const handleScroll = useCallback(() => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const nearBottom = scrollHeight - scrollTop - clientHeight < 60;
    setAutoScroll(nearBottom);
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || sending || isCreating) return;
    const body = input;
    setInput("");
    await onSend(body);
    setAutoScroll(true);
  }, [input, sending, isCreating, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const fabSize = isMobile ? 48 : 56;
  const showEmpty = messages.length === 0 && pendingMessages.length === 0;

  return (
    <>
      <Fab
        aria-label={open ? "Close chat" : "Open chat"}
        color="primary"
        onClick={() => setOpen((p) => !p)}
        sx={{
          bottom: { xs: 80, md: 24 },
          height: fabSize,
          position: "fixed",
          right: { xs: 16, md: 24 },
          width: fabSize,
          zIndex: theme.zIndex.speedDial,
          ...(open && {
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            color: "primary.main",
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.16),
            },
          }),
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={open ? "close" : "chat"}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            initial={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.15 }}
            style={{ display: "flex" }}
          >
            {open ? (
              <Close fontSize={isMobile ? "small" : "medium"} />
            ) : (
              <Chat fontSize={isMobile ? "small" : "medium"} />
            )}
          </motion.div>
        </AnimatePresence>
      </Fab>

      <AnimatePresence>
        {open && (
          <Paper
            component={motion.div}
            elevation={12}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            sx={{
              border: "1px solid",
              borderColor: alpha(theme.palette.divider, 0.08),
              borderRadius: 3,
              bottom: { xs: 138, md: 88 },
              display: "flex",
              flexDirection: "column",
              height: { xs: "60vh", md: 480 },
              maxHeight: { xs: "calc(100dvh - 180px)", md: 480 },
              maxWidth: 380,
              overflow: "hidden",
              position: "fixed",
              right: { xs: 12, md: 24 },
              width: { xs: "calc(100% - 24px)", md: 360 },
              zIndex: theme.zIndex.speedDial - 1,
            }}
          >
            <Box
              sx={{
                alignItems: "center",
                bgcolor: alpha(theme.palette.primary.main, 0.06),
                borderBottom: "1px solid",
                borderColor: alpha(theme.palette.divider, 0.08),
                display: "flex",
                gap: 1.5,
                px: 2,
                py: 1.5,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: "primary.main",
                  fontSize: "0.8rem",
                  height: 32,
                  width: 32,
                }}
              >
                S
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  Support
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.7rem",
                  }}
                >
                  {guestName ?? "Guest"} · Online
                </Typography>
              </Box>
            </Box>

            <Box
              ref={listRef}
              onScroll={handleScroll}
              sx={{
                flex: 1,
                overflowY: "auto",
                px: 2,
                py: 1.5,
                "&::-webkit-scrollbar": { width: 4 },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: alpha(theme.palette.text.primary, 0.08),
                  borderRadius: 4,
                },
              }}
            >
              {messagesLoading ? (
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    py: 4,
                  }}
                >
                  <CircularProgress size={20} />
                </Box>
              ) : showEmpty ? (
                <EmptyState />
              ) : (
                <Stack spacing={1.5}>
                  {messages.map((msg, i) => (
                    <ChatBubble
                      key={msg.id}
                      message={msg}
                      isLatest={latestMessage?.id === msg.id || i === messages.length - 1}
                      currentUserId={currentUserId}
                    />
                  ))}
                  {latestMessage && !messages.find((m) => m.id === latestMessage.id) && (
                    <ChatBubble message={latestMessage} isLatest currentUserId={currentUserId} />
                  )}
                  {pendingMessages.map((pending) => (
                    <PendingBubble
                      key={pending.id}
                      pending={pending}
                      {...(onRetry ? { onRetry } : {})}
                    />
                  ))}
                </Stack>
              )}
            </Box>

            {!autoScroll && messages.length > 0 && (
              <IconButton
                onClick={() => scrollToBottom(true)}
                size="small"
                sx={{
                  alignSelf: "center",
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  color: "primary.main",
                  mb: -4.5,
                  mt: -1,
                  position: "relative",
                  zIndex: 1,
                  "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.16) },
                }}
              >
                <ArrowDownward sx={{ fontSize: 16 }} />
              </IconButton>
            )}

            <Box
              sx={{
                borderTop: "1px solid",
                borderColor: alpha(theme.palette.divider, 0.08),
                display: "flex",
                gap: 1,
                p: 1.5,
              }}
            >
              <InputBase
                disabled={sending || isCreating}
                multiline
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isCreating ? "Starting conversation..." : "Type your message..."}
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
                disabled={!input.trim() || sending || isCreating}
                onClick={handleSend}
                size="small"
                sx={{ alignSelf: "flex-end" }}
              >
                {isCreating ? <CircularProgress size={18} /> : <SendIcon sx={{ fontSize: 18 }} />}
              </IconButton>
            </Box>
          </Paper>
        )}
      </AnimatePresence>
    </>
  );
}

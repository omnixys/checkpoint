"use client";

import type { SupportMessage } from "@/checkpoint/hooks/support/useSupportChat";
import {
  alpha,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Fab,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownward,
  Chat,
  Close,
  HelpOutlineRounded as HelpOutline,
  Send as SendIcon,
} from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";

interface SupportChatWidgetProps {
  messages: SupportMessage[];
  latestMessage: SupportMessage | null;
  onSend: (body: string) => Promise<void>;
  sending: boolean;
  guestName?: string;
  onStartConversation?: () => void;
  conversationExists: boolean;
  conversationLoading?: boolean;
}

function ChatBubble({
  message,
  isLatest,
}: {
  message: SupportMessage;
  isLatest: boolean;
}) {
  const theme = useTheme();
  const isGuest = message.fromGuest;

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
          borderRadius: isGuest
            ? "18px 18px 4px 18px"
            : "18px 18px 18px 4px",
          px: 2,
          py: 1.2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "text.primary",
            fontSize: "0.875rem",
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
            fontSize: "0.65rem",
            mt: 0.3,
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

export default function SupportChatWidget({
  messages,
  latestMessage,
  onSend,
  sending,
  guestName,
  onStartConversation,
  conversationExists,
  conversationLoading,
}: SupportChatWidgetProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollToBottom = useCallback((force = false) => {
    if (!listRef.current) return;
    if (!autoScroll && !force) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [autoScroll]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, latestMessage, scrollToBottom]);

  const handleScroll = useCallback(() => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const nearBottom = scrollHeight - scrollTop - clientHeight < 60;
    setAutoScroll(nearBottom);
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || sending) return;
    const body = input;
    setInput("");
    await onSend(body);
    setAutoScroll(true);
  }, [input, sending, onSend]);

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
              {!conversationExists && onStartConversation ? (
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
                  <HelpOutline
                    sx={{
                      color: "text.disabled",
                      fontSize: 48,
                    }}
                  />
                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    Need help?
                  </Typography>
                  <Typography
                    sx={{
                      color: "text.disabled",
                      fontSize: "0.8rem",
                      px: 2,
                      textAlign: "center",
                    }}
                  >
                    Contact the event support team. We typically reply within a few minutes.
                  </Typography>
                  <Button
                    disabled={conversationLoading}
                    onClick={onStartConversation}
                    size="small"
                    startIcon={
                      conversationLoading ? (
                        <CircularProgress size={14} />
                      ) : undefined
                    }
                    variant="contained"
                  >
                    {conversationLoading
                      ? "Starting..."
                      : "Start Conversation"}
                  </Button>
                </Box>
              ) : messages.length === 0 ? (
                <Typography
                  sx={{
                    color: "text.disabled",
                    fontSize: "0.8rem",
                    py: 4,
                    textAlign: "center",
                  }}
                >
                  No messages yet. Send a message to start the conversation.
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {messages.map((msg) => (
                    <ChatBubble
                      key={msg.id}
                      message={msg}
                      isLatest={
                        latestMessage?.id === msg.id ||
                        messages[messages.length - 1]?.id === msg.id
                      }
                    />
                  ))}
                  {latestMessage &&
                    !messages.find((m) => m.id === latestMessage.id) && (
                      <ChatBubble message={latestMessage} isLatest />
                    )}
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

            {conversationExists && (
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
                  disabled={sending}
                  multiline
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
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
            )}
          </Paper>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { Send as SendIcon } from "@mui/icons-material";
import {
  Avatar,
  alpha,
  Box,
  CircularProgress,
  IconButton,
  InputBase,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInAppConversation } from "@/checkpoint/hooks/internal/useInternalConversation";
import { useAuth } from "@/checkpoint/providers/AuthProvider";

interface Props {
  eventId: string;
  staffId: string;
  staffName: string;
}

export function InAppConversationPanel({ eventId, staffId, staffName }: Props) {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const {
    selectedConversationId,
    messages,
    messagesLoading,
    findOrCreateDirectConversation,
    sendMessage,
  } = useInAppConversation(currentUser?.id);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const findOrCreateRef = useRef(findOrCreateDirectConversation);
  findOrCreateRef.current = findOrCreateDirectConversation;

  useEffect(() => {
    if (staffId) findOrCreateRef.current(staffId);
  }, [staffId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    const body = input;
    setInput("");
    try {
      await sendMessage(body);
    } finally {
      setSending(false);
    }
  }, [input, sending, sendMessage]);

  const isOwn = (senderId: string) => senderId === currentUser?.id;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1.5,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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
          {staffName.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>{staffName}</Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
            In-App · Internal
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          py: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {messagesLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={20} />
          </Box>
        ) : messages.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ color: "text.disabled", fontSize: "0.8rem" }}>
              No messages yet. Start a conversation with {staffName}.
            </Typography>
          </Box>
        ) : (
          messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                alignSelf: isOwn(msg.senderId) ? "flex-end" : "flex-start",
                maxWidth: "78%",
              }}
            >
              <Box
                sx={{
                  background: isOwn(msg.senderId)
                    ? alpha(theme.palette.primary.main, 0.12)
                    : alpha(theme.palette.background.paper, 0.6),
                  border: "1px solid",
                  borderColor: isOwn(msg.senderId)
                    ? alpha(theme.palette.primary.main, 0.18)
                    : alpha(theme.palette.divider, 0.12),
                  borderRadius: isOwn(msg.senderId) ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  px: 1.5,
                  py: 1,
                }}
              >
                <Typography sx={{ fontSize: "0.8rem", lineHeight: 1.5 }}>{msg.body}</Typography>
              </Box>
              <Typography
                sx={{
                  color: "text.disabled",
                  fontSize: "0.6rem",
                  mt: 0.3,
                  textAlign: isOwn(msg.senderId) ? "right" : "left",
                }}
              >
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        sx={{
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          px: 2,
          py: 1.5,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <InputBase
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            sx={{
              flex: 1,
              px: 1.5,
              py: 0.75,
              borderRadius: 2,
              fontSize: "0.85rem",
              bgcolor: alpha(theme.palette.background.paper, 0.5),
              border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={!input.trim() || sending}
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.2) },
            }}
          >
            <SendIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}

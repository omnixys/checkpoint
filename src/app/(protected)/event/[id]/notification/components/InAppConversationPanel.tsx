"use client";

import { Send as SendIcon } from "@mui/icons-material";
import {
  Avatar,
  alpha,
  Box,
  IconButton,
  InputBase,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { InAppMessageList } from "@/checkpoint/components/notification/InAppMessageList";
import { useInAppConversation } from "@/checkpoint/hooks/internal/useInternalConversation";
import { useAuth } from "@/checkpoint/providers/AuthProvider";

interface Props {
  eventId: string;
  staffId: string;
  staffName: string;
}

export function InAppConversationPanel({ staffId, staffName }: Props) {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const { messages, messagesLoading, findOrCreateDirectConversation, sendMessage } =
    useInAppConversation(currentUser?.id);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const findOrCreateRef = useRef(findOrCreateDirectConversation);
  findOrCreateRef.current = findOrCreateDirectConversation;

  useEffect(() => {
    if (staffId) findOrCreateRef.current(staffId);
  }, [staffId]);

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

      <InAppMessageList
        currentUserId={currentUser?.id}
        loading={messagesLoading}
        messages={messages}
        staffName={staffName}
      />

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

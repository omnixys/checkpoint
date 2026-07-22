"use client";

import { alpha, Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useEffect, useRef } from "react";
import type { Message } from "@/checkpoint/generated/graphql";

interface InAppMessageListProps {
  currentUserId: string | undefined;
  messages: readonly Message[];
  loading: boolean;
  staffName: string;
}

export function InAppMessageList({
  currentUserId,
  messages,
  loading,
  staffName,
}: InAppMessageListProps) {
  const theme = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestMessageId = messages.at(-1)?.id;

  useEffect(() => {
    if (latestMessageId) {
      messagesEndRef.current?.scrollIntoView?.({ behavior: "smooth" });
    }
  }, [latestMessageId]);

  return (
    <Box
      data-testid="notification-message-list"
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
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={20} />
        </Box>
      ) : messages.length === 0 ? (
        <Box sx={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Typography sx={{ color: "text.disabled", fontSize: "0.8rem" }}>
            No messages yet. Start a conversation with {staffName}.
          </Typography>
        </Box>
      ) : (
        messages.map((message) => {
          const isOwn = message.senderId === currentUserId;
          return (
            <Box
              data-message-id={message.id}
              key={message.id}
              sx={{ alignSelf: isOwn ? "flex-end" : "flex-start", maxWidth: "78%" }}
            >
              <Box
                sx={{
                  background: isOwn
                    ? alpha(theme.palette.primary.main, 0.12)
                    : alpha(theme.palette.background.paper, 0.6),
                  border: "1px solid",
                  borderColor: isOwn
                    ? alpha(theme.palette.primary.main, 0.18)
                    : alpha(theme.palette.divider, 0.12),
                  borderRadius: isOwn ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  px: 1.5,
                  py: 1,
                }}
              >
                <Typography sx={{ fontSize: "0.8rem", lineHeight: 1.5 }}>{message.body}</Typography>
              </Box>
              <Typography
                sx={{
                  color: "text.disabled",
                  fontSize: "0.6rem",
                  mt: 0.3,
                  textAlign: isOwn ? "right" : "left",
                }}
              >
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
}

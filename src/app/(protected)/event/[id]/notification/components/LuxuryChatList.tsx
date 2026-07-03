"use client";

import { Avatar, alpha, Badge, Box, Typography, useTheme } from "@mui/material";
import { useMockChats } from "../hooks/useMockChats";

interface Props {
  selectedChatId: string | null;
  onSelect: (id: string) => void;
}

export function LuxuryChatList({ selectedChatId, onSelect }: Props) {
  const { chats } = useMockChats();
  const _theme = useTheme();

  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        p: 2,
        background: alpha("#0A0A0F", 0.9),
      }}
    >
      {chats.map((chat) => {
        const active = chat.chatId === selectedChatId;

        return (
          <Box
            key={chat.id}
            onClick={() => onSelect(chat.chatId)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 1.5,
              mb: 1,
              borderRadius: 3,
              cursor: "pointer",
              transition: "all 0.2s",
              background: active
                ? "linear-gradient(135deg, rgba(91,140,255,0.2), rgba(123,97,255,0.2))"
                : "transparent",
              "&:hover": {
                background: alpha("#ffffff", 0.05),
              },
            }}
          >
            <Badge badgeContent={chat.unread} color="primary">
              <Avatar src={chat.avatar} />
            </Badge>

            <Box sx={{ flex: 1 }}>
              <Typography color="white" sx={{ fontWeight: 600 }}>
                {chat.name}
              </Typography>
              <Typography variant="body2" color="gray">
                {chat.lastMessage}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

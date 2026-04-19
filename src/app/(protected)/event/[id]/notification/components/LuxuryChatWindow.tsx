"use client";

import { Box, Typography } from "@mui/material";
import { useMockMessages } from "../hooks/useMockMessages";

type Props = {
  chatId: string | null;
};

export function LuxuryChatWindow({ chatId }: Props) {
  const { messages } = useMockMessages(chatId);

  if (!chatId) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "gray",
        }}
      >
        Select a conversation
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
      {messages.map((msg) => {
        const isOwn = msg.direction === "OUTBOUND";

        return (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent: isOwn ? "flex-end" : "flex-start",
              mb: 2,
            }}
          >
            <Box
              sx={{
                px: 2.5,
                py: 1.5,
                borderRadius: 3,
                maxWidth: "60%",
                background: isOwn
                  ? "linear-gradient(135deg, #5B8CFF, #7B61FF)"
                  : "rgba(255,255,255,0.05)",
                color: "white",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography>{msg.body}</Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

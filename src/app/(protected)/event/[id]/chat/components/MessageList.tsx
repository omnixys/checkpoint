"use client";

import { Box, Typography } from "@mui/material";

type Props = {
  messages: any[];
};

export function MessageList({ messages }: Props) {
  return (
    <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
      {messages.map((msg) => {
        const isOwn = msg.direction === "OUTBOUND";

        return (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent: isOwn ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                maxWidth: "70%",
                bgcolor: isOwn ? "primary.main" : "grey.200",
                color: isOwn ? "white" : "black",
              }}
            >
              <Typography variant="body2">{msg.body}</Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

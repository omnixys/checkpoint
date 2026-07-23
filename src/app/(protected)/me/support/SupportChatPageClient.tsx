"use client";

import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import SupportChatWidget from "@/checkpoint/components/support/chat/SupportChatWidget";
import { useSupportChat } from "@/checkpoint/hooks/support/useSupportChat";

export default function SupportChatPage() {
  const theme = useTheme();
  const {
    messages,
    pendingMessages,
    latestMessage,
    sendMessage,
    retryMessage,
    sending,
    isCreating,
    messagesLoading,
  } = useSupportChat({});

  return (
    <Stack spacing={4} sx={{ maxWidth: 700, mx: "auto", width: "100%" }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          p: 3,
          borderRadius: 4,
          backdropFilter: "blur(20px)",
          background: alpha(theme.palette.background.paper, 0.6),
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Support
        </Typography>
        <Typography color="text.secondary">
          {messages.length > 0 || pendingMessages.length > 0
            ? "Your conversation with our support team"
            : "Describe your issue and we'll connect you with our support team"}
        </Typography>
      </Box>

      <Box sx={{ height: "60vh", minHeight: 400, position: "relative" }}>
        <SupportChatWidget
          guestName="Me"
          latestMessage={latestMessage}
          messages={messages}
          pendingMessages={pendingMessages}
          sending={sending}
          isCreating={isCreating}
          onSend={sendMessage}
          onRetry={retryMessage}
          messagesLoading={messagesLoading}
        />
      </Box>
    </Stack>
  );
}

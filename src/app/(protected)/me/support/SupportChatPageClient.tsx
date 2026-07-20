"use client";

import {
  alpha,
  Box,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { useSupportChat } from "@/checkpoint/hooks/support/useSupportChat";
import SupportChatWidget from "@/checkpoint/components/support/chat/SupportChatWidget";

export default function SupportChatPage() {
  const theme = useTheme();
  const {
    conversationId,
    messages,
    latestMessage,
    sendMessage,
    sending,
    myConversations,
    conversationsLoading,
    initializeConversation,
    isCreating,
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
          {conversationId
            ? "Your conversation with our support team"
            : "Start a conversation with our support team"}
        </Typography>
      </Box>

      {conversationsLoading || isCreating ? (
        <Typography color="text.disabled" sx={{ textAlign: "center", py: 4 }}>
          Loading...
        </Typography>
      ) : !conversationId && myConversations.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.disabled" sx={{ mb: 2 }}>
            No active conversations. Start one from the RSVP page or contact us directly.
          </Typography>
        </Box>
      ) : null}

      {conversationId && (
        <Box sx={{ height: "60vh", minHeight: 400, position: "relative" }}>
          <SupportChatWidget
            guestName="Me"
            latestMessage={latestMessage}
            messages={messages}
            sending={sending}
            onSend={sendMessage}
            conversationExists
          />
        </Box>
      )}
    </Stack>
  );
}

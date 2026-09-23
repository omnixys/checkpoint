"use client";

import type { Message } from "@/checkpoint/generated/graphql";
import type { PendingMessage } from "@/checkpoint/hooks/support/useSupportChat";

type SupportMessage = Message;

import { Chat, Close } from "@mui/icons-material";
import { Avatar, alpha, Box, Fab, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  realtimeStatusLabel,
  useRealtimeStatus,
} from "@/checkpoint/hooks/support/useRealtimeStatus";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { SupportChatPanel } from "./SupportChatPanel";

interface SupportChatWidgetProps {
  messages: SupportMessage[];
  pendingMessages?: PendingMessage[];
  latestMessage: SupportMessage | null;
  onSend: (body: string) => Promise<void>;
  onRetry?: (pending: PendingMessage) => Promise<void>;
  sending: boolean;
  isCreating?: boolean;
  guestName?: string;
  currentUserId?: string | undefined;
  messagesLoading?: boolean;
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
  const t = useTypedTranslations("support");
  const realtimeStatus = useRealtimeStatus();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);

  const fabSize = isMobile ? 48 : 56;

  return (
    <>
      <Fab
        aria-label={open ? t("closeChat") : t("openChat")}
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
                  {t("title")}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.7rem",
                  }}
                >
                  {guestName ?? t("guest")} · {realtimeStatusLabel(realtimeStatus)}
                </Typography>
              </Box>
            </Box>

            <SupportChatPanel
              messages={messages}
              pendingMessages={pendingMessages}
              latestMessage={latestMessage}
              onSend={onSend}
              onRetry={onRetry}
              sending={sending}
              isCreating={isCreating}
              currentUserId={currentUserId}
              messagesLoading={messagesLoading}
            />
          </Paper>
        )}
      </AnimatePresence>
    </>
  );
}

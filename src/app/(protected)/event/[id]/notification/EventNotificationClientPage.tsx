"use client";

import { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { NotificationChannelTabs } from "./components/NotificationChannelTabs";
import { NotificationSidebar } from "./components/NotificationSidebar";
import { NotificationConversationPanel } from "./components/NotificationConversationPanel";
import { NotificationChannel } from "./types/notification-channel.enum";
import { getNotificationTone } from "@/checkpoint/app/(protected)/event/[id]/notification/themes/notificationTheme";

const MotionBox = motion.create(Box);

export default function EventNotificationClientPage() {
  const theme = useTheme();

  const [channel, setChannel] = useState<NotificationChannel>(NotificationChannel.WHATSAPP);
  const [selectedChatId, setSelectedChatId] = useState<string | null>("wa-chat-1");

  function handleChannelChange(nextChannel: NotificationChannel) {
    setChannel(nextChannel);

    if (nextChannel === NotificationChannel.WHATSAPP) {
      setSelectedChatId("wa-chat-1");
      return;
    }

    if (nextChannel === NotificationChannel.IN_APP) {
      setSelectedChatId("ia-chat-1");
      return;
    }

    setSelectedChatId("em-chat-1");
  }

  const tone = getNotificationTone(theme, channel);

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        height: "100dvh",
        overflow: "hidden",
        backgroundColor: theme.palette.background.default,
        px: { xs: 0, md: 1.5 },
        py: { xs: 0, md: 1.5 },
      }}
    >
      <MotionBox
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        sx={{
          height: "100%",
          overflow: "hidden",
          borderRadius: { xs: 0, md: 4 },
          border: `1px solid ${tone.cardBorder}`,
          backgroundColor: tone.panelBgStrong,
          // boxShadow: `0 24px 64px ${tone.shadow}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <NotificationChannelTabs value={channel} onChange={handleChannelChange} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            flex: 1,
            minHeight: 0,
          }}
        >
          <NotificationSidebar
            channel={channel}
            selectedChatId={selectedChatId}
            onSelect={setSelectedChatId}
          />

          <AnimatePresence mode="wait">
            <MotionBox
              key={`${channel}-${selectedChatId}`}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              sx={{
                flex: 1,
                minWidth: 0,
                height: "100%",
                backgroundColor: tone.panelBg,
              }}
            >
              <NotificationConversationPanel channel={channel} chatId={selectedChatId} />
            </MotionBox>
          </AnimatePresence>
        </Box>
      </MotionBox>
    </Box>
  );
}

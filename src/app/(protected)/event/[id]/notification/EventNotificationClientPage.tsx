"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import RouteGuard from "@/checkpoint/components/guard/RouteGuard";
import { getNotificationTone } from "@/checkpoint/app/(protected)/event/[id]/notification/themes/notificationTheme";
import { InAppConversationPanel } from "./components/InAppConversationPanel";
import { InAppStaffSidebar } from "./components/InAppStaffSidebar";
import { NotificationChannelTabs } from "./components/NotificationChannelTabs";
import { NotificationConversationPanel } from "./components/NotificationConversationPanel";
import { NotificationSidebar } from "./components/NotificationSidebar";
import { useNotificationItems } from "./hooks/useNotificationMocks";
import { NotificationChannel } from "./types/notification-channel.enum";
import { useEventStaff } from "@/checkpoint/hooks/events/useEventStaff";
import { useConversationUnread, useConversationUnreadSubscription } from "@/checkpoint/hooks/support/useConversationUnread";

const MotionBox = motion.create(Box);

function ConversationUnreadWatcher({
  conversationId,
  onUpdate,
}: {
  conversationId: string | null;
  onUpdate: (conversationId: string, unreadCount: number) => void;
}) {
  const { unreadUpdate } = useConversationUnreadSubscription(conversationId);
  useEffect(() => {
    if (unreadUpdate) onUpdate(unreadUpdate.conversationId, unreadUpdate.unreadCount);
  }, [unreadUpdate, onUpdate]);
  return null;
}

export default function EventNotificationClientPage() {
  const params = useParams<{ id: string }>();
  const eventId = params.id;
  const theme = useTheme();

  const [channel, setChannel] = useState<NotificationChannel>(NotificationChannel.WHATSAPP);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  const isInApp = channel === NotificationChannel.IN_APP;

  const { items } = useNotificationItems(channel, eventId);
  const {
    conversations: unreadConversations,
    markAsRead,
  } = useConversationUnread(eventId);

  const { staffMap } = useEventStaff({ eventId, skip: !isInApp });

  const selectedStaffName = selectedStaffId
    ? staffMap.get(selectedStaffId)?.personalInfo?.firstName
      ? `${staffMap.get(selectedStaffId)!.personalInfo!.firstName!} ${staffMap.get(selectedStaffId)!.personalInfo?.lastName ?? ""}`
      : staffMap.get(selectedStaffId)?.username ?? selectedStaffId.slice(0, 8)
    : "";

  const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const map: Record<string, number> = {};
    for (const c of unreadConversations) {
      if (c.unreadCount && c.unreadCount > 0) map[c.id] = c.unreadCount;
    }
    setUnreadMap(map);
  }, [unreadConversations]);

  const handleUnreadUpdate = useCallback((conversationId: string, unreadCount: number) => {
    setUnreadMap((prev) => ({ ...prev, [conversationId]: unreadCount }));
  }, []);

  const handleSelectChat = useCallback((chatId: string) => {
    setSelectedChatId(chatId);
    const count = unreadMap[chatId];
    if (count && count > 0) markAsRead(chatId);
  }, [unreadMap, markAsRead]);

  const previousChannelRef = useRef(channel);
  const hasAutoSelectedRef = useRef(false);

  useEffect(() => {
    if (channel !== previousChannelRef.current) {
      previousChannelRef.current = channel;
      setSelectedChatId(null);
      setSelectedStaffId(null);
      hasAutoSelectedRef.current = false;
      return;
    }
    if (isInApp || hasAutoSelectedRef.current) return;
    const first = items[0];
    if (!selectedChatId && first && first.channel === channel) {
      hasAutoSelectedRef.current = true;
      handleSelectChat(first.chatId);
    }
  }, [items, channel, selectedChatId, handleSelectChat, isInApp]);

  function handleChannelChange(nextChannel: NotificationChannel) {
    setChannel(nextChannel);
  }

  const tone = getNotificationTone(theme, channel);

  const subConversationId = isInApp ? null : selectedChatId;

  return (
    <>
    <ConversationUnreadWatcher
      conversationId={subConversationId}
      onUpdate={handleUnreadUpdate}
    />
    <RouteGuard featureId="notifications">
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
          {isInApp ? (
            <Box sx={{ width: { xs: "100%", md: 340 }, maxWidth: { xs: "100%", md: 340 }, height: "100%" }}>
              <InAppStaffSidebar
                eventId={eventId}
                selectedStaffId={selectedStaffId}
                onSelect={setSelectedStaffId}
              />
            </Box>
          ) : (
            <NotificationSidebar
              channel={channel}
              selectedChatId={selectedChatId}
              onSelect={handleSelectChat}
              onMarkAsRead={markAsRead}
              eventId={eventId}
              unreadMap={unreadMap}
            />
          )}

          <AnimatePresence mode="wait">
            <MotionBox
              key={`${channel}-${isInApp ? selectedStaffId : selectedChatId}`}
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
              {isInApp && selectedStaffId ? (
                <InAppConversationPanel
                  eventId={eventId}
                  staffId={selectedStaffId}
                  staffName={selectedStaffName}
                />
              ) : (
                <NotificationConversationPanel
                  channel={channel}
                  chatId={selectedChatId}
                  eventId={eventId}
                />
              )}
            </MotionBox>
          </AnimatePresence>
        </Box>
      </MotionBox>
    </Box>
    </RouteGuard>
    </>
  );
}

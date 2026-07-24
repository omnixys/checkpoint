"use client";

import { alpha, Box, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import RouteGuard from "@/checkpoint/components/guard/RouteGuard";
import { resolveStaffName, useEventStaff } from "@/checkpoint/hooks/events/useEventStaff";
import { useConversationUnread } from "@/checkpoint/hooks/support/useConversationUnread";
import type { WorkspaceChannel } from "../_shared";
import { ConversationUnreadWatcher, WorkspaceChannelTabs, WorkspacePanel } from "../_shared";
import { InAppConversationPanel } from "./components/InAppConversationPanel";
import { InAppStaffSidebar } from "./components/InAppStaffSidebar";
import { NotificationConversationPanel } from "./components/NotificationConversationPanel";
import { NotificationSidebar } from "./components/NotificationSidebar";
import { useNotificationItems } from "./hooks/useNotificationMocks";
import type { NotificationChannel } from "./types/notification-channel.enum";

const MotionBox = motion.create(Box);

export default function EventNotificationClientPage() {
  const params = useParams<{ id: string }>();
  const eventId = params.id;
  const theme = useTheme();

  const [channel, setChannel] = useState<WorkspaceChannel>("WHATSAPP");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  const isInApp = channel === "IN_APP";

  const { items } = useNotificationItems(channel as NotificationChannel, eventId);
  const { conversations: unreadConversations, markAsRead } = useConversationUnread(eventId);

  const { staffMap } = useEventStaff({ eventId, skip: !isInApp });

  const selectedStaffMember = selectedStaffId ? staffMap.get(selectedStaffId) : undefined;
  const selectedStaffName = selectedStaffMember ? resolveStaffName(selectedStaffMember) : "";

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

  const handleSelectChat = useCallback(
    (chatId: string) => {
      setSelectedChatId(chatId);
      const count = unreadMap[chatId];
      if (count && count > 0) markAsRead(chatId);
    },
    [unreadMap, markAsRead],
  );

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
    if (!selectedChatId && first && first.channel === (channel as NotificationChannel)) {
      hasAutoSelectedRef.current = true;
      handleSelectChat(first.chatId);
    }
  }, [items, channel, selectedChatId, handleSelectChat, isInApp]);

  function handleChannelChange(nextChannel: WorkspaceChannel) {
    setChannel(nextChannel);
  }

  const subConversationId = isInApp ? null : selectedChatId;

  return (
    <>
      <ConversationUnreadWatcher conversationId={subConversationId} onUpdate={handleUnreadUpdate} />
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
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.72),
              backdropFilter: "blur(20px) saturate(150%)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <WorkspaceChannelTabs
              title="Notification Center"
              subtitle="Omnichannel communication workspace"
              value={channel}
              onChange={handleChannelChange}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                flex: 1,
                minHeight: 0,
              }}
            >
              {isInApp ? (
                <Box
                  sx={{
                    width: { xs: "100%", md: 340 },
                    maxWidth: { xs: "100%", md: 340 },
                    height: "100%",
                  }}
                >
                  <InAppStaffSidebar
                    eventId={eventId}
                    selectedStaffId={selectedStaffId}
                    onSelect={setSelectedStaffId}
                  />
                </Box>
              ) : (
                <NotificationSidebar
                  channel={channel as NotificationChannel}
                  selectedChatId={selectedChatId}
                  onSelect={handleSelectChat}
                  onMarkAsRead={markAsRead}
                  eventId={eventId}
                  unreadMap={unreadMap}
                />
              )}

              <WorkspacePanel panelKey={`${channel}-${isInApp ? selectedStaffId : selectedChatId}`}>
                {isInApp && selectedStaffId ? (
                  <InAppConversationPanel
                    eventId={eventId}
                    staffId={selectedStaffId}
                    staffName={selectedStaffName}
                  />
                ) : (
                  <NotificationConversationPanel
                    channel={channel as NotificationChannel}
                    chatId={selectedChatId}
                    eventId={eventId}
                  />
                )}
              </WorkspacePanel>
            </Box>
          </MotionBox>
        </Box>
      </RouteGuard>
    </>
  );
}

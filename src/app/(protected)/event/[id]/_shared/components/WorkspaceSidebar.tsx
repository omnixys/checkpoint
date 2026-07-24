"use client";

import { Box, Divider, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import type { WorkspaceChannel } from "../workspaceTheme";
import { getWorkspaceTone } from "../workspaceTheme";
import { WorkspaceConversationCard } from "./WorkspaceConversationCard";

interface ConversationItem {
  id: string;
  displayName: string;
  channel: WorkspaceChannel;
  lastMessage: string | null;
  lastMessageAt: string | null;
  externalAddress?: string | null;
}

interface Props {
  channel: WorkspaceChannel;
  selectedId: string | null;
  conversations: ConversationItem[];
  unreadMap: Record<string, number> | Map<string, number>;
  onSelect: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  headerTitle?: string;
  headerSubtitle?: string;
}

function getUnread(unreadMap: Record<string, number> | Map<string, number>, id: string): number {
  if (unreadMap instanceof Map) return unreadMap.get(id) ?? 0;
  return unreadMap[id] ?? 0;
}

export function WorkspaceSidebar({
  channel,
  selectedId,
  conversations,
  unreadMap,
  onSelect,
  onMarkAsRead,
  headerTitle = "Conversations",
  headerSubtitle,
}: Props) {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const tone = getWorkspaceTone(theme, channel);

  const subtitle =
    headerSubtitle ??
    `${conversations.length} active conversation${conversations.length !== 1 ? "s" : ""}`;

  return (
    <Box
      sx={{
        width: { xs: "100%", md: isTablet ? 280 : 370 },
        maxWidth: { xs: "100%", md: isTablet ? 280 : 370 },
        height: { xs: "auto", md: "100%" },
        maxHeight: { xs: "38dvh", md: "none" },
        borderRight: { xs: 0, md: `1px solid ${tone.divider}` },
        borderBottom: { xs: `1px solid ${tone.divider}`, md: 0 },
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ px: 2.5, py: 2.25 }}>
        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: 0,
            overflowWrap: "anywhere",
          }}
        >
          {headerTitle}
        </Typography>

        <Typography variant="body2" sx={{ mt: 0.5, color: tone.textSecondary }}>
          {subtitle}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: tone.divider }} />

      <Box sx={{ flex: 1, overflowY: "auto", p: 1.5 }}>
        <Stack spacing={1.1}>
          {conversations.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ color: tone.textSecondary, textAlign: "center", py: 4 }}
            >
              No conversations in this channel
            </Typography>
          ) : (
            conversations.map((conversation, index) => (
              <WorkspaceConversationCard
                key={conversation.id}
                id={conversation.id}
                displayName={conversation.displayName}
                channel={conversation.channel}
                lastMessage={conversation.lastMessage}
                lastMessageAt={conversation.lastMessageAt}
                externalAddress={conversation.externalAddress}
                unread={getUnread(unreadMap, conversation.id)}
                selected={conversation.id === selectedId}
                index={index}
                onSelect={() => {
                  onSelect(conversation.id);
                  const unread = getUnread(unreadMap, conversation.id);
                  if (unread > 0) onMarkAsRead?.(conversation.id);
                }}
              />
            ))
          )}
        </Stack>
      </Box>
    </Box>
  );
}

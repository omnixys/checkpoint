"use client";

import { Avatar, Badge, Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { sidebarCardHover, sidebarCardStagger } from "../workspaceAnimation";
import type { WorkspaceChannel } from "../workspaceTheme";
import { getChannelLabel, getWorkspaceTone } from "../workspaceTheme";
import { formatRelativeTime } from "../workspaceUtils";

interface ConversationCardProps {
  id: string;
  displayName: string;
  channel: WorkspaceChannel;
  lastMessage: string | null;
  lastMessageAt: string | null;
  externalAddress?: string | null | undefined;
  unread: number;
  selected: boolean;
  accent?: string;
  index: number;
  onSelect: () => void;
}

const MotionBox = motion.create(Box);

export function WorkspaceConversationCard({
  id,
  displayName,
  channel,
  lastMessage,
  lastMessageAt,
  externalAddress,
  unread,
  selected,
  accent,
  index,
  onSelect,
}: ConversationCardProps) {
  const theme = useTheme();
  const tone = getWorkspaceTone(theme, channel);
  const displayAccent = accent ?? tone.accent;
  const channelLabel = getChannelLabel(channel);

  return (
    <MotionBox
      key={id}
      {...sidebarCardStagger(index)}
      {...sidebarCardHover}
      onClick={onSelect}
      sx={{
        cursor: "pointer",
        borderRadius: 3,
        p: 1.5,
        border: `1px solid ${selected ? tone.cardBorderSelected : tone.cardBorder}`,
        backgroundColor: selected ? tone.cardBgSelected : tone.cardBg,
        transition: "all 160ms ease",
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
        <Badge color="primary" badgeContent={unread > 0 ? unread : 0} invisible={unread === 0}>
          <Avatar
            sx={{
              width: 50,
              height: 50,
              fontWeight: 700,
              color: theme.palette.text.primary,
              backgroundColor: alpha(displayAccent, 0.14),
              border: `1px solid ${alpha(displayAccent, 0.28)}`,
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
        </Badge>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap={true}
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 700,
                  letterSpacing: 0,
                }}
              >
                {displayName}
              </Typography>

              <Typography
                noWrap={true}
                variant="caption"
                sx={{ color: alpha(theme.palette.text.primary, 0.5) }}
              >
                {externalAddress ?? channelLabel}
              </Typography>
            </Box>

            <Typography
              variant="caption"
              sx={{
                color: alpha(theme.palette.text.primary, 0.42),
                whiteSpace: "nowrap",
              }}
            >
              {formatRelativeTime(lastMessageAt)}
            </Typography>
          </Stack>

          <Typography
            sx={{
              mt: 0.9,
              color: alpha(theme.palette.text.primary, 0.72),
              fontSize: 13.5,
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {lastMessage ?? "No messages yet"}
          </Typography>

          <Stack direction="row" spacing={0.75} sx={{ mt: 1, flexWrap: "wrap" }}>
            <Chip
              size="small"
              label={channelLabel}
              sx={{
                height: 22,
                color: displayAccent,
                backgroundColor: alpha(displayAccent, 0.14),
                border: `1px solid ${alpha(displayAccent, 0.28)}`,
              }}
            />
          </Stack>
        </Box>
      </Stack>
    </MotionBox>
  );
}

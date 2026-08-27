"use client";

import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import HeadsetMicRoundedIcon from "@mui/icons-material/HeadsetMicRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import {
  Avatar,
  alpha,
  Badge,
  Box,
  Chip,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import type { ConversationView, SupportChannel } from "@/checkpoint/hooks/support/useEventSupport";
import { getSupportTone } from "../supportTheme";

interface Props {
  channel: SupportChannel;
  selectedId: string | null;
  conversations: ConversationView[];
  unreadMap: Map<string, number>;
  onSelect: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
}

const MotionBox = motion.create(Box);

function channelInfo(channel: string) {
  switch (channel) {
    case "WHATSAPP":
      return {
        label: "WhatsApp",
        color: "#25D366" as const,
        icon: <ChatRoundedIcon sx={{ fontSize: 16 }} />,
      };
    case "EMAIL":
      return {
        label: "Email",
        color: undefined,
        icon: <MailRoundedIcon sx={{ fontSize: 16 }} />,
      };
    default:
      return {
        label: "In-App",
        color: undefined,
        icon: <HeadsetMicRoundedIcon sx={{ fontSize: 16 }} />,
      };
  }
}

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function SupportSidebar({
  channel,
  selectedId,
  conversations,
  unreadMap,
  onSelect,
  onMarkAsRead,
}: Props) {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const tone = getSupportTone(theme, channel);

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
          Conversations
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            color: tone.textSecondary,
          }}
        >
          {conversations.length} active conversation{conversations.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: tone.divider }} />

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 1.5,
        }}
      >
        <Stack spacing={1.1}>
          {conversations.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ color: tone.textSecondary, textAlign: "center", py: 4 }}
            >
              No conversations in this channel
            </Typography>
          ) : (
            conversations.map((conversation, index) => {
              const selected = conversation.id === selectedId;
              const unread = unreadMap.get(conversation.id) ?? 0;
              const displayName = conversation.externalDisplayName ?? "Guest";
              const info = channelInfo(conversation.channel);

              return (
                <MotionBox
                  key={conversation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.03,
                  }}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.997 }}
                  onClick={() => {
                    onSelect(conversation.id);
                    if (unread > 0) onMarkAsRead?.(conversation.id);
                  }}
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
                    <Badge
                      color="primary"
                      badgeContent={unread > 0 ? unread : 0}
                      invisible={unread === 0}
                    >
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                          backgroundColor: alpha(tone.accent, 0.14),
                          border: `1px solid ${alpha(tone.accent, 0.28)}`,
                        }}
                      >
                        {displayName.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                        }}
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

                          <Stack
                            direction="row"
                            spacing={0.5}
                            sx={{ alignItems: "center", mt: 0.25 }}
                          >
                            <Typography
                              noWrap={true}
                              variant="caption"
                              sx={{
                                color: alpha(theme.palette.text.primary, 0.5),
                              }}
                            >
                              {conversation.externalAddress ?? info.label}
                            </Typography>
                          </Stack>
                        </Box>

                        <Typography
                          variant="caption"
                          sx={{
                            color: alpha(theme.palette.text.primary, 0.42),
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatRelativeTime(conversation.lastMessageAt)}
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
                        {conversation.lastMessage ?? "No messages yet"}
                      </Typography>

                      <Stack direction="row" spacing={0.75} sx={{ mt: 1, flexWrap: "wrap" }}>
                        <Chip
                          size="small"
                          label={info.label}
                          sx={{
                            height: 22,
                            color: info.color ?? theme.palette.text.primary,
                            backgroundColor: info.color
                              ? alpha(info.color, 0.14)
                              : alpha(theme.palette.primary.main, 0.14),
                            border: `1px solid ${info.color ? alpha(info.color, 0.28) : alpha(theme.palette.primary.main, 0.28)}`,
                          }}
                        />
                      </Stack>
                    </Box>
                  </Stack>
                </MotionBox>
              );
            })
          )}
        </Stack>
      </Box>
    </Box>
  );
}

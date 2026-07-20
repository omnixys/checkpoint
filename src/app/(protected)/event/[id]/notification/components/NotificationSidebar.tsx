"use client";

import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
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
import { useNotificationItems } from "@/checkpoint/app/(protected)/event/[id]/notification/hooks/useNotificationMocks";
import { getNotificationTone, getPriorityColor, getStatusColor } from "../themes/notificationTheme";
import type {
  EmailThread,
  InAppChat,
  NotificationListItem,
  WhatsAppChat,
} from "../types/notification.models";
import { NotificationChannel } from "../types/notification-channel.enum";

interface Props {
  channel: NotificationChannel;
  selectedChatId: string | null;
  onSelect: (chatId: string) => void;
  onMarkAsRead?: (chatId: string) => void;
  eventId: string;
  unreadMap?: Record<string, number>;
}

const MotionBox = motion.create(Box);

function isWhatsApp(item: NotificationListItem): item is WhatsAppChat {
  return item.channel === NotificationChannel.WHATSAPP;
}

function isInApp(item: NotificationListItem): item is InAppChat {
  return item.channel === NotificationChannel.IN_APP;
}

function isEmail(item: NotificationListItem): item is EmailThread {
  return item.channel === NotificationChannel.EMAIL;
}

function getTitle(item: NotificationListItem): string {
  if (isWhatsApp(item)) {
    return item.contactName;
  }
  if (isInApp(item)) {
    return item.userName;
  }
  return item.subject;
}

function getSubtitle(item: NotificationListItem): string {
  if (isWhatsApp(item)) {
    return item.phoneNumber;
  }
  if (isInApp(item)) {
    return item.handle;
  }
  return `${item.fromName} · ${item.fromEmail}`;
}

function getPreview(item: NotificationListItem): string {
  if (isWhatsApp(item)) {
    return item.lastMessage;
  }
  if (isInApp(item)) {
    return item.preview;
  }
  return item.preview;
}

function getTime(item: NotificationListItem): string {
  if (isWhatsApp(item)) {
    return item.lastMessageAt;
  }
  return item.updatedAt;
}

function getLeadingIcon(item: NotificationListItem) {
  if (isWhatsApp(item)) {
    return <ForumRoundedIcon sx={{ fontSize: 16 }} />;
  }

  if (isInApp(item)) {
    return <VerifiedRoundedIcon sx={{ fontSize: 16 }} />;
  }

  return <AlternateEmailRoundedIcon sx={{ fontSize: 16 }} />;
}

export function NotificationSidebar({ channel, selectedChatId, onSelect, onMarkAsRead, eventId, unreadMap }: Props) {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const tone = getNotificationTone(theme, channel);
  const { items } = useNotificationItems(channel, eventId);

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
          Channel-specific conversation overview
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
          {items.map((item, index) => {
            const selected = item.chatId === selectedChatId;

            const avatarAccent = isEmail(item)
              ? theme.palette.secondary.main
              : "avatarColor" in item
                ? item.avatarColor
                : tone.accent;

            return (
              <MotionBox
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.03,
                }}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.997 }}
                onClick={() => {
                  onSelect(item.chatId);
                  onMarkAsRead?.(item.chatId);
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
                    badgeContent={(() => {
                      const real = unreadMap?.[item.chatId] ?? item.unreadCount;
                      return real > 0 ? real : 0;
                    })()}
                    invisible={(() => {
                      const real = unreadMap?.[item.chatId] ?? item.unreadCount;
                      return real === 0;
                    })()}
                  >
                    <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        backgroundColor: alpha(avatarAccent, 0.14),
                        border: `1px solid ${alpha(avatarAccent, 0.28)}`,
                      }}
                    >
                      {getLeadingIcon(item)}
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
                          {getTitle(item)}
                        </Typography>

                        <Typography
                          noWrap={true}
                          variant="caption"
                          sx={{
                            color: alpha(theme.palette.text.primary, 0.5),
                          }}
                        >
                          {getSubtitle(item)}
                        </Typography>
                      </Box>

                      <Typography
                        variant="caption"
                        sx={{
                          color: alpha(theme.palette.text.primary, 0.42),
                          whiteSpace: "nowrap",
                        }}
                      >
                        {getTime(item)}
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
                      {getPreview(item)}
                    </Typography>

                    {isWhatsApp(item) ? (
                      <Stack direction="row" spacing={0.75} sx={{ mt: 1, flexWrap: "wrap" }}>
                        {item.labels.map((label) => (
                          <Chip
                            key={label}
                            size="small"
                            label={label}
                            sx={{
                              height: 22,
                              color: theme.palette.text.primary,
                              backgroundColor: alpha(theme.palette.success.main, 0.14),
                              border: `1px solid ${alpha(theme.palette.success.main, 0.28)}`,
                            }}
                          />
                        ))}
                      </Stack>
                    ) : null}

                    {isInApp(item) ? (
                      <Stack direction="row" spacing={0.75} sx={{ mt: 1 }}>
                        <Chip
                          size="small"
                          label={item.priority}
                          sx={{
                            height: 22,
                            color: theme.palette.text.primary,
                            backgroundColor: alpha(getPriorityColor(theme, item.priority), 0.14),
                            border: `1px solid ${alpha(
                              getPriorityColor(theme, item.priority),
                              0.28,
                            )}`,
                          }}
                        />
                        <Chip
                          size="small"
                          label={item.status}
                          sx={{
                            height: 22,
                            color: theme.palette.text.primary,
                            backgroundColor: alpha(getStatusColor(theme, item.status), 0.14),
                            border: `1px solid ${alpha(getStatusColor(theme, item.status), 0.28)}`,
                          }}
                        />
                      </Stack>
                    ) : null}

                    {isEmail(item) ? (
                      <Stack
                        direction="row"
                        spacing={0.75}
                        sx={{ mt: 1, alignItems: "center", flexWrap: "wrap" }}
                      >
                        <Chip
                          size="small"
                          label={item.category}
                          sx={{
                            height: 22,
                            color: theme.palette.text.primary,
                            backgroundColor: alpha(theme.palette.secondary.main, 0.14),
                            border: `1px solid ${alpha(theme.palette.secondary.main, 0.28)}`,
                          }}
                        />
                        {item.hasAttachment ? (
                          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                            <AttachFileRoundedIcon
                              sx={{
                                fontSize: 15,
                                color: alpha(theme.palette.text.primary, 0.55),
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                color: alpha(theme.palette.text.primary, 0.5),
                              }}
                            >
                              Attachment
                            </Typography>
                          </Stack>
                        ) : null}
                      </Stack>
                    ) : null}
                  </Box>
                </Stack>
              </MotionBox>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}

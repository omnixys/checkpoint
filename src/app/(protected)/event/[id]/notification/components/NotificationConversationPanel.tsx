"use client";

import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  alpha,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useNotificationItems, useNotificationMessages } from "../hooks/useNotificationMocks";
import {
  getEventTypeColor,
  getNotificationTone,
  getPriorityColor,
  getStatusColor,
} from "../themes/notificationTheme";
import type {
  EmailMessage,
  EmailThread,
  InAppChat,
  InAppMessage,
  NotificationListItem,
  NotificationMessage,
  WhatsAppChat,
  WhatsAppMessage,
} from "../types/notification.models";
import { NotificationChannel } from "../types/notification-channel.enum";

interface Props {
  channel: NotificationChannel;
  chatId: string | null;
}

const MotionBox = motion.create(Box);

function isWhatsAppItem(item: NotificationListItem): item is WhatsAppChat {
  return item.channel === NotificationChannel.WHATSAPP;
}

function isInAppItem(item: NotificationListItem): item is InAppChat {
  return item.channel === NotificationChannel.IN_APP;
}

function isEmailItem(item: NotificationListItem): item is EmailThread {
  return item.channel === NotificationChannel.EMAIL;
}

function isWhatsAppMessage(message: NotificationMessage): message is WhatsAppMessage {
  return message.channel === NotificationChannel.WHATSAPP;
}

function isInAppMessage(message: NotificationMessage): message is InAppMessage {
  return message.channel === NotificationChannel.IN_APP;
}

function isEmailMessage(message: NotificationMessage): message is EmailMessage {
  return message.channel === NotificationChannel.EMAIL;
}

function SharedTextField({
  value,
  onChange,
  placeholder,
  multiline = false,
  minRows,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  multiline?: boolean | undefined;
  minRows?: number | undefined;
}) {
  const theme = useTheme();

  return (
    <TextField
      fullWidth={true}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      multiline={multiline}
      minRows={minRows}
      sx={{
        "& .MuiInputBase-root": {
          color: theme.palette.text.primary,
        },
        "& .MuiOutlinedInput-root": {
          borderRadius: multiline ? 3 : 999,
          backgroundColor: theme.palette.extended.surface.level2,
          border: `1px solid ${theme.palette.extended.border.subtle}`,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: alpha(theme.palette.common.white, 0.14),
        },
        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: alpha(theme.palette.common.white, 0.2),
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
        "& .MuiInputBase-input::placeholder": {
          color: alpha(theme.palette.text.primary, 0.52),
          opacity: 1,
        },
        "& .MuiInputBase-input.MuiInputBase-inputMultiline": {
          lineHeight: 1.6,
        },
      }}
    />
  );
}

function EmptyState({ channel }: { channel: NotificationChannel }) {
  const theme = useTheme();
  const tone = getNotificationTone(theme, channel);

  return (
    <Box
      sx={{
        flex: 1,
        display: "grid",
        placeItems: "center",
        p: 4,
      }}
    >
      <MotionBox
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        sx={{
          maxWidth: 560,
          width: "100%",
          p: 4,
          borderRadius: 4,
          border: `1px solid ${tone.cardBorder}`,
          backgroundColor: tone.cardBg,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            letterSpacing: 0,
            overflowWrap: "anywhere",
          }}
        >
          Select a conversation
        </Typography>

        <Typography
          sx={{
            mt: 1.25,
            color: tone.textSecondary,
            lineHeight: 1.7,
          }}
        >
          Choose a conversation from the left sidebar to open the detail view.
        </Typography>
      </MotionBox>
    </Box>
  );
}

function WhatsAppHeader({ item }: { item: WhatsAppChat }) {
  const theme = useTheme();

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" } }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: 20,
            overflowWrap: "anywhere",
          }}
        >
          {item.contactName}
        </Typography>
        <Typography
          sx={{
            mt: 0.4,
            color: alpha(theme.palette.text.primary, 0.58),
            fontSize: 13,
          }}
        >
          {item.phoneNumber} · {item.isOnline ? "Online now" : "Last seen recently"}
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
        {item.labels.map((label) => (
          <Chip
            key={label}
            label={label}
            sx={{
              color: theme.palette.text.primary,
              backgroundColor: alpha(theme.palette.success.main, 0.14),
              border: `1px solid ${alpha(theme.palette.success.main, 0.26)}`,
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
}

function InAppHeader({ item }: { item: InAppChat }) {
  const theme = useTheme();
  const priorityColor = getPriorityColor(theme, item.priority);
  const statusColor = getStatusColor(theme, item.status);

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" } }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: 20,
            overflowWrap: "anywhere",
          }}
        >
          {item.title}
        </Typography>
        <Typography
          sx={{
            mt: 0.4,
            color: alpha(theme.palette.text.primary, 0.58),
            fontSize: 13,
          }}
        >
          {item.userName} · {item.handle}
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
        <Chip
          label={item.priority}
          sx={{
            color: theme.palette.text.primary,
            backgroundColor: alpha(priorityColor, 0.16),
            border: `1px solid ${alpha(priorityColor, 0.28)}`,
          }}
        />
        <Chip
          label={item.status}
          sx={{
            color: theme.palette.text.primary,
            backgroundColor: alpha(statusColor, 0.16),
            border: `1px solid ${alpha(statusColor, 0.28)}`,
          }}
        />
      </Stack>
    </Stack>
  );
}

function EmailHeader({ item }: { item: EmailThread }) {
  const theme = useTheme();

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" } }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: 20,
            overflowWrap: "anywhere",
          }}
        >
          {item.subject}
        </Typography>
        <Typography
          sx={{
            mt: 0.4,
            color: alpha(theme.palette.text.primary, 0.58),
            fontSize: 13,
          }}
        >
          {item.fromName} · {item.fromEmail}
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
        <Chip
          label={item.category}
          sx={{
            color: theme.palette.text.primary,
            backgroundColor: alpha(theme.palette.secondary.main, 0.14),
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.28)}`,
          }}
        />
        {item.hasAttachment ? (
          <Chip
            label="Attachment"
            sx={{
              color: theme.palette.text.primary,
              backgroundColor: alpha(theme.palette.common.white, 0.05),
              border: `1px solid ${theme.palette.extended.border.subtle}`,
            }}
          />
        ) : null}
      </Stack>
    </Stack>
  );
}

function WhatsAppTimeline({ messages }: { messages: WhatsAppMessage[] }) {
  const theme = useTheme();

  return (
    <Stack spacing={1.25}>
      {messages.map((message, index) => {
        const own = message.direction === "OUTBOUND";

        return (
          <MotionBox
            key={message.id}
            initial={{ opacity: 0, x: own ? 12 : -12, y: 4 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.18, delay: index * 0.03 }}
            sx={{
              display: "flex",
              justifyContent: own ? "flex-end" : "flex-start",
            }}
          >
            <Box
              sx={{
                maxWidth: { xs: "86%", sm: "62%" },
                px: 2,
                py: 1.35,
                borderRadius: own ? "22px 22px 8px 22px" : "22px 22px 22px 8px",
                backgroundColor: own
                  ? alpha(theme.palette.success.main, 0.16)
                  : alpha(theme.palette.common.white, 0.04),
                color: theme.palette.text.primary,
                border: `1px solid ${
                  own
                    ? alpha(theme.palette.success.main, 0.32)
                    : alpha(theme.palette.common.white, 0.08)
                }`,
              }}
            >
              <Typography sx={{ fontSize: 14.5, lineHeight: 1.6 }}>{message.body}</Typography>

              <Stack
                direction="row"
                spacing={0.6}
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 0.9,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 11.5,
                    color: alpha(theme.palette.text.primary, 0.64),
                  }}
                >
                  {message.timestamp}
                </Typography>

                {own ? (
                  <DoneAllRoundedIcon
                    sx={{
                      fontSize: 15,
                      color: message.seen
                        ? theme.palette.success.main
                        : alpha(theme.palette.text.primary, 0.6),
                    }}
                  />
                ) : null}
              </Stack>
            </Box>
          </MotionBox>
        );
      })}
    </Stack>
  );
}

function InAppTimeline({ messages }: { messages: InAppMessage[] }) {
  const theme = useTheme();

  return (
    <Stack spacing={1.5}>
      {messages.map((message, index) => {
        const color = getEventTypeColor(theme, message.eventType);

        return (
          <MotionBox
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            sx={{
              borderRadius: 3,
              p: 2,
              border: `1px solid ${alpha(color, 0.28)}`,
              backgroundColor: alpha(color, 0.08),
            }}
          >
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: color,
                  }}
                />
                <Typography sx={{ color: theme.palette.text.primary, fontWeight: 700 }}>
                  {message.title ?? message.eventType}
                </Typography>
              </Stack>

              <Chip
                label={message.eventType}
                sx={{
                  color: theme.palette.text.primary,
                  backgroundColor: alpha(color, 0.14),
                  border: `1px solid ${alpha(color, 0.24)}`,
                }}
              />
            </Stack>

            <Typography
              sx={{
                mt: 1.2,
                color: alpha(theme.palette.text.primary, 0.76),
                lineHeight: 1.7,
                fontSize: 14.5,
              }}
            >
              {message.body}
            </Typography>

            <Typography
              sx={{
                mt: 1.2,
                color: alpha(theme.palette.text.primary, 0.46),
                fontSize: 12,
              }}
            >
              {message.actor} · {message.timestamp}
            </Typography>
          </MotionBox>
        );
      })}
    </Stack>
  );
}

function EmailTimeline({ messages }: { messages: EmailMessage[] }) {
  const theme = useTheme();

  return (
    <Stack spacing={1.5}>
      {messages.map((message, index) => (
        <MotionBox
          key={message.id}
          initial={{ opacity: 0, y: 12, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
          sx={{
            borderRadius: 3,
            p: 2.5,
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.22)}`,
            backgroundColor: alpha(theme.palette.secondary.main, 0.08),
          }}
        >
          <Stack spacing={0.65}>
            <Typography
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 700,
                fontSize: 17,
              }}
            >
              {message.subject}
            </Typography>
            <Typography
              sx={{
                color: alpha(theme.palette.text.primary, 0.58),
                fontSize: 13,
              }}
            >
              From: {message.fromName} &lt;{message.fromEmail}&gt;
            </Typography>
            <Typography
              sx={{
                color: alpha(theme.palette.text.primary, 0.58),
                fontSize: 13,
              }}
            >
              To: {message.toName} &lt;{message.toEmail}&gt;
            </Typography>
            <Typography
              sx={{
                color: alpha(theme.palette.text.primary, 0.44),
                fontSize: 12,
              }}
            >
              {message.timestamp}
            </Typography>
          </Stack>

          <Divider sx={{ my: 2, borderColor: theme.palette.extended.border.subtle }} />

          <Typography
            sx={{
              whiteSpace: "pre-line",
              color: alpha(theme.palette.text.primary, 0.78),
              lineHeight: 1.8,
              fontSize: 14.5,
            }}
          >
            {message.body}
          </Typography>
        </MotionBox>
      ))}
    </Stack>
  );
}

function ConversationInput({ channel }: { channel: NotificationChannel }) {
  const theme = useTheme();
  const tone = getNotificationTone(theme, channel);
  const [value, setValue] = useState("");

  const buttonIcon =
    channel === NotificationChannel.EMAIL ? (
      <MailOutlineRoundedIcon />
    ) : channel === NotificationChannel.IN_APP ? (
      <BoltRoundedIcon />
    ) : (
      <SendRoundedIcon />
    );

  const buttonLabel =
    channel === NotificationChannel.EMAIL
      ? "Send Mail"
      : channel === NotificationChannel.IN_APP
        ? "Add Update"
        : "Send";

  const placeholder =
    channel === NotificationChannel.EMAIL
      ? "Compose reply..."
      : channel === NotificationChannel.IN_APP
        ? "Add workflow note or status update..."
        : "Type a WhatsApp message...";

  return (
    <Box
      sx={{
        p: 2,
        borderTop: `1px solid ${tone.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.25}
        sx={{
          alignItems: {
            xs: "stretch",
            sm: channel === NotificationChannel.EMAIL ? "stretch" : "center",
          },
        }}
      >
        <SharedTextField
          value={value}
          onChange={setValue}
          placeholder={placeholder}
          multiline={channel === NotificationChannel.EMAIL}
          minRows={channel === NotificationChannel.EMAIL ? 3 : undefined}
        />

        <Button
          variant="contained"
          startIcon={buttonIcon}
          sx={{
            minWidth: { xs: "100%", sm: channel === NotificationChannel.IN_APP ? 170 : 160 },
            borderRadius: channel === NotificationChannel.EMAIL ? 3 : 999,
            backgroundColor: tone.accent,
            color: theme.palette.getContrastText(tone.accent),
            boxShadow: "none",
            "&:hover": {
              backgroundColor: tone.accent,
              boxShadow: "none",
            },
          }}
        >
          {buttonLabel}
        </Button>
      </Stack>
    </Box>
  );
}

export function NotificationConversationPanel({ channel, chatId }: Props) {
  const theme = useTheme();
  const tone = getNotificationTone(theme, channel);

  const { items } = useNotificationItems(channel);
  const { messages } = useNotificationMessages(channel, chatId);

  const selectedItem = useMemo(
    () => items.find((item) => item.chatId === chatId) ?? null,
    [items, chatId],
  );

  if (!selectedItem) {
    return <EmptyState channel={channel} />;
  }

  return (
    <Box
      sx={{
        flex: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 2.25,
          borderBottom: `1px solid ${tone.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {isWhatsAppItem(selectedItem) ? <WhatsAppHeader item={selectedItem} /> : null}
        {isInAppItem(selectedItem) ? <InAppHeader item={selectedItem} /> : null}
        {isEmailItem(selectedItem) ? <EmailHeader item={selectedItem} /> : null}
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: { xs: 2, md: 3 },
          py: 2.5,
          backgroundColor: theme.palette.background.default,
        }}
      >
        {channel === NotificationChannel.WHATSAPP ? (
          <WhatsAppTimeline messages={messages.filter(isWhatsAppMessage)} />
        ) : null}

        {channel === NotificationChannel.IN_APP ? (
          <InAppTimeline messages={messages.filter(isInAppMessage)} />
        ) : null}

        {channel === NotificationChannel.EMAIL ? (
          <EmailTimeline messages={messages.filter(isEmailMessage)} />
        ) : null}
      </Box>

      <ConversationInput channel={channel} />
    </Box>
  );
}

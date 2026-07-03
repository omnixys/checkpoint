import { alpha, type Theme } from "@mui/material/styles";
import { NotificationChannel } from "../types/notification-channel.enum";

function getBaseAlpha(theme: Theme, value: number) {
  // Dark → white overlay
  // Light → black overlay
  return alpha(
    theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black,
    value,
  );
}

export function getNotificationTone(theme: Theme, channel: NotificationChannel) {
  const accent =
    channel === NotificationChannel.WHATSAPP
      ? theme.palette.success.main
      : channel === NotificationChannel.IN_APP
        ? theme.palette.primary.main
        : theme.palette.secondary.main;

  return {
    accent,
    accentSoft: alpha(accent, 0.12),
    accentBorder: alpha(accent, 0.28),

    panelBg: theme.palette.background.default,
    panelBgStrong: theme.palette.background.paper,

    cardBg: getBaseAlpha(theme, 0.03),
    cardBgSelected: alpha(accent, 0.1),

    cardBorder: getBaseAlpha(theme, 0.08),
    cardBorderSelected: alpha(accent, 0.3),

    textPrimary: theme.palette.text.primary,
    textSecondary: alpha(theme.palette.text.primary, 0.64),

    inputBg: theme.palette.background.paper,
    inputBorder: getBaseAlpha(theme, 0.14),

    divider: getBaseAlpha(theme, 0.08),

    shadow: alpha(theme.palette.common.black, 0.2),
    glow: alpha(accent, 0.1),
  };
}

export function getPriorityColor(theme: Theme, priority: string): string {
  if (priority === "HIGH") {
    return theme.palette.error.main;
  }
  if (priority === "MEDIUM") {
    return theme.palette.warning.main;
  }
  return theme.palette.primary.main;
}

export function getStatusColor(theme: Theme, status: string): string {
  if (status === "OPEN") {
    return theme.palette.primary.main;
  }
  if (status === "PENDING") {
    return theme.palette.warning.main;
  }
  return theme.palette.success.main;
}

export function getEventTypeColor(theme: Theme, eventType: string): string {
  if (eventType === "ALERT") {
    return theme.palette.error.main;
  }
  if (eventType === "STATUS_CHANGE") {
    return theme.palette.primary.main;
  }
  if (eventType === "INTERNAL_NOTE") {
    return theme.palette.secondary.main;
  }
  return theme.palette.info.main;
}

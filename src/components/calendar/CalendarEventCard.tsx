"use client";

import { JSX } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { EventPayload } from "@/checkpoint/generated/graphql";
import { useEventReminder } from "@/checkpoint/hooks/calendar/useEventReminder";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";

type Props = {
  event: EventPayload;
};

export default function CalendarEventCard({ event }: Props): JSX.Element {
  const theme = useTheme();
  const { scheduleReminder } = useEventReminder();

  const start = new Date(event.settings.startsAt).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const end = new Date(event.settings.endsAt).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Box
      sx={{
        mb: 1.2,
        px: 2,
        py: 1.5,
        borderRadius: 20,
        backgroundColor: theme.palette.apple.systemBackground,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        display: "flex",
        gap: 2,
        alignItems: "center",
      }}
    >
      {/* Accent Bar */}
      <Box
        sx={{
          width: 4,
          alignSelf: "stretch",
          borderRadius: 2,
          backgroundColor: theme.palette.omnixys.primary,
        }}
      />

      <IconButton size="small" onClick={() => scheduleReminder(event, 30)}>
        <NotificationsActiveRoundedIcon fontSize="small" />
      </IconButton>

      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontWeight: 600,
            color: theme.palette.omnixys.textPrimary,
          }}
        >
          {event.name}
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            color: theme.palette.omnixys.textSecondary,
          }}
        >
          {start} – {end}
        </Typography>
      </Box>
    </Box>
  );
}

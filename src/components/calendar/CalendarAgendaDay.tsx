"use client";

import { JSX } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Event } from "@/types/event/event.type";
import CalendarEventCard from "./CalendarEventCard";

type Props = {
  date: Date;
  events: readonly Event[];
  onSelectDay?: (date: Date) => void;
};

export default function CalendarAgendaDay({
  date,
  events,
  onSelectDay,
}: Props): JSX.Element {
  const theme = useTheme();

  const isToday = new Date().toDateString() === date.toDateString();

  return (
    <Box sx={{ mb: 3 }}>
      {/* Sticky Day Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          backgroundColor: theme.palette.apple.secondarySystemBackground,
          pb: 1,
        }}
      >
        <Typography
          onClick={() => onSelectDay?.(date)}
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color: isToday
              ? theme.palette.omnixys.primary
              : theme.palette.omnixys.textPrimary,
          }}
        >
          {isToday
            ? "Heute"
            : date.toLocaleDateString("de-DE", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
        </Typography>
      </Box>

      {/* Events */}
      {events.map((event) => (
        <CalendarEventCard key={event.id} event={event} />
      ))}
    </Box>
  );
}

"use client";

import { JSX, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type {
  Event,
  EventListHandle,
  EventsFilter,
} from "@/types/event/event.type";

type Props = {
  date: Date;
  events: readonly Event[];
};

export default function CalendarDayCell({ date, events }: Props): JSX.Element {
  const theme = useTheme();

  const isToday = new Date().toDateString() === date.toDateString();

  const dayEvents = useMemo(
    () =>
      events.filter(
        (e) => new Date(e.startsAt).toDateString() === date.toDateString()
      ),
    [events, date]
  );

  return (
    <Box
      sx={{
        minHeight: 92,
        p: 1,
        borderRadius: 3,
        backgroundColor: isToday
          ? `${theme.palette.omnixys.primary}22`
          : theme.palette.apple.tertiarySystemBackground,
        border: `1px solid ${theme.palette.apple.separator}`,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: isToday ? 700 : 500,
          color: isToday
            ? theme.palette.omnixys.primary
            : theme.palette.omnixys.textSecondary,
        }}
      >
        {date.getDate()}
      </Typography>

      {dayEvents.map((event) => (
        <Box
          key={event.id}
          sx={{
            mt: 0.5,
            px: 0.75,
            py: 0.25,
            borderRadius: 999,
            backgroundColor: theme.palette.omnixys.primary,
            color: theme.palette.apple.systemBackground,
            fontSize: 11,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {event.name}
        </Box>
      ))}
    </Box>
  );
}

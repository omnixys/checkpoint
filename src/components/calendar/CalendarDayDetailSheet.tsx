"use client";

import { JSX } from "react";
import { Drawer, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Event } from "@/types/event/event.type";
import CalendarEventCard from "./CalendarEventCard";

type Props = {
  open: boolean;
  date: Date | null;
  events: readonly Event[];
  onClose: () => void;
};

export default function CalendarDayDetailSheet({
  open,
  date,
  events,
  onClose,
}: Props): JSX.Element {
  const theme = useTheme();

  if (!date) return <></>;

  const dayEvents = events.filter(
    (e) => new Date(e.startsAt).toDateString() === date.toDateString()
  );

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Box sx={{ p: 3 }}>
        <Typography
          sx={{
            mb: 2,
            fontWeight: 700,
            color: theme.palette.omnixys.textPrimary,
          }}
        >
          {date.toLocaleDateString("de-DE", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </Typography>

        {dayEvents.map((event) => (
          <CalendarEventCard key={event.id} event={event} />
        ))}
      </Box>
    </Drawer>
  );
}

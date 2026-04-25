"use client";

import CalendarEventCard from "@/checkpoint/components/calendar/CalendarEventCard";
import { getEventsForDay } from "@/checkpoint/utils/calendar/calendar.utils";
import { Box, Drawer, Typography } from "@mui/material";

type Props = {
  open: boolean;
  date: Date | null;
  events: readonly any[];
  onClose: () => void;
};

export default function CalendarDaySheet({
  open,
  date,
  events,
  onClose,
}: Props) {
  if (!date) return null;

  const dayEvents = getEventsForDay(events, date);

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Box sx={{ p: 3 }}>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>
          {date.toLocaleDateString("de-DE")}
        </Typography>

        {dayEvents.map((e) => (
          <CalendarEventCard key={e.id} event={e} />
        ))}
      </Box>
    </Drawer>
  );
}

"use client";

import CalendarEventCard from "@/checkpoint/components/calendar/CalendarEventCard";
import { GetMyEventCalendarDataQuery } from "@/checkpoint/generated/graphql";
import { getEventsForDay } from "@/checkpoint/utils/calendar/calendar.utils";
import { Box, Drawer, Typography } from "@mui/material";

type Props = {
  open: boolean;
  date: Date | null;
  events: GetMyEventCalendarDataQuery["myEvents"];
  onClose: () => void;
};

export default function CalendarDaySheet({ open, date, events, onClose }: Props) {
  if (!date) return null;

  const dayEvents = getEventsForDay(events, date);

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Box
        sx={{
          maxHeight: "80dvh",
          overflowY: "auto",
          p: { xs: 2, sm: 3 },
          pb: "calc(24px + env(safe-area-inset-bottom))",
        }}
      >
        <Typography sx={{ fontWeight: 700, mb: 2 }}>{date.toLocaleDateString("de-DE")}</Typography>

        {dayEvents.map((e) => (
          <CalendarEventCard key={e.id} event={e} />
        ))}
      </Box>
    </Drawer>
  );
}

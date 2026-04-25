"use client";

import CalendarEventCard from "@/checkpoint/components/calendar/CalendarEventCard";
import { Box, Typography } from "@mui/material";

type Props = {
  grouped: Map<string, any[]>;
  onSelectDay: (date: Date) => void;
};

export default function CalendarAgendaView({ grouped, onSelectDay }: Props) {
  return (
    <>
      {[...grouped.entries()].map(([date, events]) => {
        const d = new Date(date);

        return (
          <Box key={date} sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 700 }} onClick={() => onSelectDay(d)}>
              {d.toLocaleDateString("de-DE", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Typography>

            {events.map((event) => (
              <CalendarEventCard key={event.id} event={event} />
            ))}
          </Box>
        );
      })}
    </>
  );
}

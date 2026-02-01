"use client";

import { JSX, useMemo } from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import CalendarDayCell from "./CalendarDayCell";
import type {
  Event,
  EventListHandle,
  EventsFilter,
} from "@/types/event/event.type";


type Props = {
  year: number;
  month: number; // 0-based
  events: readonly Event[];
};

export default function CalendarMonthGrid({
  year,
  month,
  events,
}: Props): JSX.Element {
    const theme = useTheme();
  const days = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);

    const result: Date[] = [];
    for (let d = 1; d <= last.getDate(); d++) {
      result.push(new Date(year, month, d));
    }
    return result;
  }, [year, month]);

  return (
    <Box>
      <Stack
        direction="row"
        flexWrap="wrap"
        sx={{
          width: "100%",
        }}
      >
        {days.map((day) => (
          <CalendarDayCell key={day.toISOString()} date={day} events={events} />
        ))}
      </Stack>
    </Box>
  );
}

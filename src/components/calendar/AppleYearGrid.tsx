"use client";

import { JSX } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Event } from "@/types/event/event.type";
import AppleMonthGrid from "./AppleMonthGrid";

type Props = {
  year: number;
  events: readonly Event[];
  onSelectDay?: (date: Date) => void;
  onSelectMonth?: (month: number) => void;
};

export default function AppleYearGrid({
  year,
  events,
  onSelectDay,
  onSelectMonth,
}: Props): JSX.Element {
  const theme = useTheme();

  return (
    <Box sx={{ display: "grid", gap: 4 }}>
      {Array.from({ length: 12 }).map((_, month) => (
        <Box key={month}>
          <Typography
            onClick={() => onSelectMonth?.(month)}
            sx={{
              mb: 1,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {new Date(year, month).toLocaleString("de-DE", { month: "long" })}
          </Typography>

          <AppleMonthGrid
            year={year}
            month={month}
            events={events}
            onSelectDay={onSelectDay}
          />
        </Box>
      ))}
    </Box>
  );
}

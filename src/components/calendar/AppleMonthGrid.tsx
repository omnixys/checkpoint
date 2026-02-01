"use client";

import { JSX, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Event } from "@/types/event/event.type";

type Props = {
  year: number;
  month: number; // 0-based
  events: readonly Event[];
  onSelectDay?: (date: Date) => void;
};

export default function AppleMonthGrid({
  year,
  month,
  events,
  onSelectDay,
}: Props): JSX.Element {
  const theme = useTheme();

  const days = useMemo(() => {
    const last = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: last }, (_, i) => new Date(year, month, i + 1));
  }, [year, month]);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 1,
      }}
    >
      {days.map((date) => {
        const hasEvents = events.some(
          (e) => new Date(e.startsAt).toDateString() === date.toDateString()
        );

        return (
          <Box
            key={date.toISOString()}
            onClick={() => onSelectDay?.(date)}
            sx={{
              p: 1,
              minHeight: 64,
              borderRadius: 3,
              cursor: "pointer",
              backgroundColor: hasEvents
                ? `${theme.palette.omnixys.primary}18`
                : theme.palette.apple.tertiarySystemBackground,
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: theme.palette.omnixys.textPrimary }}
            >
              {date.getDate()}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

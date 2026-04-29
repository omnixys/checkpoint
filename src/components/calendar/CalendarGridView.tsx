"use client";

import { GetMyEventCalendarDataQuery } from "@/checkpoint/generated/graphql";
import { getEventsForDay } from "@/checkpoint/utils/calendar/calendar.utils";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type Props = {
  date: Date;
  mode: "month" | "year";
  events: GetMyEventCalendarDataQuery["myEvents"];
  onSelectDay: (date: Date) => void;
  onSelectMonth: (month: number) => void;
};

export default function CalendarGridView({
  date,
  mode,
  events,
  onSelectDay,
  onSelectMonth,
}: Props) {
  const theme = useTheme();

  if (mode === "year") {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        {Array.from({ length: 12 }).map((_, m) => {
          const monthDate = new Date(date.getFullYear(), m, 1);

          const monthEvents = events.filter(
            (e) =>
              new Date(e.settings?.startsAt).getMonth() === m &&
              new Date(e.settings?.startsAt).getFullYear() === date.getFullYear(),
          );

          return (
            <Box
              key={m}
              onClick={() => onSelectMonth(m)}
              sx={{
                p: 2,
                borderRadius: 4,
                cursor: "pointer",
                transition: "all 0.2s ease",
                backgroundColor: theme.palette.apple.tertiarySystemBackground,

                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                {monthDate.toLocaleString("de-DE", { month: "long" })}
              </Typography>

              {/* Event Preview Dots */}
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {monthEvents.slice(0, 6).map((e) => (
                  <Box
                    key={e.id}
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.primary.main,
                    }}
                  />
                ))}
              </Box>

              {/* Count */}
              {monthEvents.length > 0 && (
                <Typography
                  sx={{
                    mt: 1,
                    fontSize: 12,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {monthEvents.length} Events
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    );
  }

  const days = Array.from(
    { length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() },
    (_, i) => new Date(date.getFullYear(), date.getMonth(), i + 1),
  );

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
      {days.map((d) => {
        const hasEvents = getEventsForDay(events, d).length > 0;

        return (
          <Box
            key={d.toISOString()}
            onClick={() => onSelectDay(d)}
            sx={{
              p: 1,
              borderRadius: 3,
              cursor: "pointer",
              backgroundColor: hasEvents
                ? `${theme.palette.primary.main}18`
                : theme.palette.apple.tertiarySystemBackground,
            }}
          >
            {d.getDate()}
          </Box>
        );
      })}
    </Box>
  );
}

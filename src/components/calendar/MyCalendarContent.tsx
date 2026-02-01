"use client";

import { JSX, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@apollo/client/react";
import type { Event } from "@/types/event/event.type";

import CalendarViewSwitch from "./CalendarViewSwitch";
import type { CalendarView } from "./calendar-view.type";
import { MY_EVENTS } from "@/graphql/event/event-query.graphql";
import type { MyEventsResult } from "@/types/event/event-query-graphql.type";

import CalendarAgendaView from "./CalendarAgendaView";
import CalendarGridView from "./CalendarGridView";
import CalendarDayDetailSheet from "./CalendarDayDetailSheet";
import CalendarTodayButton from "./CalendarTodayButton";

export default function MyCalendarContent(): JSX.Element {
  const theme = useTheme();

  /* -------------------------------------------------------
   * View mode (persisted)
   * ----------------------------------------------------- */
  const [view, setView] = useState<CalendarView>("list");
  const [visibleDate, setVisibleDate] = useState<Date>(new Date());

  const goToday = () => setVisibleDate(new Date());

  useEffect(() => {
    const stored = localStorage.getItem("calendar:view");
    if (stored === "list" || stored === "grid") {
      setView(stored);
    }
  }, []);

  const handleViewChange = (v: CalendarView) => {
    setView(v);
    localStorage.setItem("calendar:view", v);
  };

  /* -------------------------------------------------------
   * Day selection (shared between grid + agenda)
   * ----------------------------------------------------- */
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  /* -------------------------------------------------------
   * Data
   * ----------------------------------------------------- */
  const { data, loading, error } = useQuery<MyEventsResult>(MY_EVENTS, {
    fetchPolicy: "cache-and-network",
  });

  const events: readonly Event[] = data?.myEvents ?? [];

  /* -------------------------------------------------------
   * States
   * ----------------------------------------------------- */
  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography sx={{ color: theme.palette.omnixys.textSecondary }}>
          Kalender wird geladen…
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color={theme.palette.omnixys.error}>
          Kalender konnte nicht geladen werden.
        </Typography>
      </Box>
    );
  }

  /* -------------------------------------------------------
   * UI
   * ----------------------------------------------------- */
  return (
    <Box
      sx={{
        px: 2,
        pb: 4,
        backgroundColor: theme.palette.apple.secondarySystemBackground,
        minHeight: "100%",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mt: 2,
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: theme.palette.omnixys.textPrimary,
          }}
        >
          Kalender
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <CalendarTodayButton onClick={goToday} />
          <CalendarViewSwitch value={view} onChange={handleViewChange} />
        </Box>
      </Box>

      {/* Views */}

      {view === "list" ? (
        <CalendarAgendaView
          events={events}
          visibleDate={visibleDate}
          onSelectDay={setSelectedDay}
        />
      ) : (
        <CalendarGridView
          events={events}
          visibleDate={visibleDate}
          onChangeDate={setVisibleDate}
          onSelectDay={setSelectedDay}
        />
      )}

      {/* Day Detail Sheet */}
      <CalendarDayDetailSheet
        open={!!selectedDay}
        date={selectedDay}
        events={events}
        onClose={() => setSelectedDay(null)}
      />
    </Box>
  );
}

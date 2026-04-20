"use client";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CalendarToolbar from "./CalendarToolbar";
import CalendarGridView from "./CalendarGridView";
import CalendarAgendaView from "./CalendarAgendaView";
import CalendarDaySheet from "./CalendarDaySheet";
import { useCalendar } from "@/checkpoint/hooks/calendar/useCalendar";
import { useCalendarData } from "@/checkpoint/hooks/calendar/useCalendarData";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

export default function MyCalendarContent() {
  const theme = useTheme();

  const tCommon = useTypedTranslations("common");
  const tErrors = useTypedTranslations("error");

  const { events, loading, error } = useCalendarData();
  const calendar = useCalendar(events);

if (loading) return <Typography>{tCommon("loading")}</Typography>;
if (error) return <Typography>{tErrors("generic")}</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <CalendarToolbar
        date={calendar.visibleDate}
        mode={calendar.mode}
        view={calendar.view}
        onNavigate={calendar.navigate}
        onChangeView={calendar.setView}
        onChangeMode={calendar.setMode}
        onToday={calendar.goToday}
      />

      {calendar.view === "list" ? (
        <CalendarAgendaView
          grouped={calendar.groupedEvents}
          onSelectDay={calendar.setSelectedDay}
        />
      ) : (
        <CalendarGridView
          date={calendar.visibleDate}
          mode={calendar.mode}
          events={events}
          // onSelectDay={calendar.setSelectedDay}
          onSelectDay={(date) => {
            calendar.setSelectedDay(date);
            calendar.setView("grid"); // switch to day grid automatically
          }}
          onSelectMonth={(m) => {
            calendar.setVisibleDate(new Date(calendar.visibleDate.getFullYear(), m, 1));
            calendar.setMode("month");
          }}
        />
      )}

      <CalendarDaySheet
        open={!!calendar.selectedDay}
        date={calendar.selectedDay}
        events={events}
        onClose={() => calendar.setSelectedDay(null)}
      />
    </Box>
  );
}

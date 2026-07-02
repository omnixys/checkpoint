"use client";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CalendarToolbar from "./CalendarToolbar";
import CalendarGridView from "./CalendarGridView";
import CalendarAgendaView from "./CalendarAgendaView";
import CalendarDaySheet from "./CalendarDaySheet";
import { useCalendar } from "@/checkpoint/hooks/calendar/useCalendar";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import useMyEventQuery from "@/checkpoint/hooks/events/useMyEventQuery";

export default function MyCalendarContent() {
  const theme = useTheme();

  const tCommon = useTypedTranslations("common");
  const tErrors = useTypedTranslations("error");

  const { myEventCalendarData, myEventCalendarDataError, myEventCalendarDataLoading } =
    useMyEventQuery({ loadMyEventCalendarData: true });
  const calendar = useCalendar(myEventCalendarData);

  if (myEventCalendarDataLoading) return <Typography>{tCommon("loading")}</Typography>;
  if (myEventCalendarDataError) return <Typography>{tErrors("generic")}</Typography>;

  if (!myEventCalendarData) return;
  if (!calendar.groupedEvents) return;

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2 }, minWidth: 0 }}>
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
          events={myEventCalendarData}
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
        events={myEventCalendarData}
        onClose={() => calendar.setSelectedDay(null)}
      />
    </Box>
  );
}

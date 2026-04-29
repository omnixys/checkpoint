import { GetMyEventCalendarDataQuery } from "@/checkpoint/generated/graphql";
import { groupEventsByDay } from "@/checkpoint/utils/calendar/calendar.utils";
import { addMonths, addYears } from "@/checkpoint/utils/date-utils";
import { useMemo, useState } from "react";

export type CalendarView = "list" | "grid";
export type CalendarMode = "month" | "year";

/**
 * Central calendar state management.
 * This is the single source of truth for all calendar behavior.
 */
export function useCalendar(events: GetMyEventCalendarDataQuery["myEvents"] | undefined) {
  const [view, setView] = useState<CalendarView>("list");
  const [mode, setMode] = useState<CalendarMode>("month");
  const [visibleDate, setVisibleDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const groupedEvents = useMemo(() => groupEventsByDay(events), [events]);

  const goToday = () => setVisibleDate(new Date());

  const navigate = (dir: "prev" | "next") => {
    if (mode === "month") {
      setVisibleDate(addMonths(visibleDate, dir === "next" ? 1 : -1));
    } else {
      setVisibleDate(addYears(visibleDate, dir === "next" ? 1 : -1));
    }
  };

  return {
    view,
    mode,
    visibleDate,
    selectedDay,
    groupedEvents,
    setView,
    setMode,
    setVisibleDate,
    setSelectedDay,
    goToday,
    navigate,
  };
}

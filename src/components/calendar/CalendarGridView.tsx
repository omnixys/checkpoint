"use client";

import { JSX, useState } from "react";
import { Box } from "@mui/material";
import type { Event } from "@/types/event/event.type";
import AppleMonthGrid from "./AppleMonthGrid";
import AppleYearGrid from "./AppleYearGrid";
import { addMonths, addYears } from "./calendar-date.util";
import { CalendarGridViewMode } from "./calendar-view.type";
import CalendarGridModeSwitch from "./CalendarGridModeSwitch";
import CalendarNavigationHeader from "./CalendarNavigationHeader";

type Props = {
  events: readonly Event[];
  visibleDate: Date;
  onChangeDate: (date: Date) => void;
  onSelectDay?: (date: Date) => void;
};

export default function CalendarGridView({
  events,
  visibleDate,
  onChangeDate,
  onSelectDay,
}: Props): JSX.Element {
  const [mode, setMode] = useState<CalendarGridViewMode>("month");

  const handleNavigate = (dir: "prev" | "next") => {
    if (mode === "month") {
      onChangeDate(addMonths(visibleDate, dir === "next" ? 1 : -1));
    } else {
      onChangeDate(addYears(visibleDate, dir === "next" ? 1 : -1));
    }
  };

  const handleSelectMonth = (month: number) => {
    onChangeDate(new Date(visibleDate.getFullYear(), month, 1));
    setMode("month");
  };


  return (
    <Box>
      {/* Header */}
      <CalendarNavigationHeader
        date={visibleDate}
        unit={mode}
        onNavigate={handleNavigate}
      />

      {/* Month / Year Switch */}
      <CalendarGridModeSwitch value={mode} onChange={setMode} />

      <Box sx={{ mt: 3 }}>
        {mode === "month" ? (
          <AppleMonthGrid
            year={visibleDate.getFullYear()}
            month={visibleDate.getMonth()}
            events={events}
            onSelectDay={onSelectDay}
          />
        ) : (
          <AppleYearGrid
            year={visibleDate.getFullYear()}
            events={events}
            onSelectDay={onSelectDay}
            onSelectMonth={handleSelectMonth}
          />
        )}
      </Box>
    </Box>
  );
}

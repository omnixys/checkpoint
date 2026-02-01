"use client";

import { JSX, useMemo } from "react";
import type { Event } from "@/types/event/event.type";
import CalendarAgendaDay from "./CalendarAgendaDay";

type Props = {
  events: readonly Event[];
  onSelectDay?: (date: Date) => void;
  visibleDate: Date;
};


export default function CalendarAgendaView({ events, onSelectDay }: Props): JSX.Element {
  const grouped = useMemo(() => {
    const map = new Map<string, Event[]>();

    for (const event of events) {
      const key = new Date(event.startsAt).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(event);
    }

    return [...map.entries()].sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
    );
  }, [events]);

  return (
    <>
      {grouped.map(([date, dayEvents]) => (
        <CalendarAgendaDay
          key={date}
          date={new Date(date)}
          events={dayEvents}
          onSelectDay={onSelectDay}
        />
      ))}
    </>
  );
}

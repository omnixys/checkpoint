"use client";

import MyCalendarContent from "@/checkpoint/components/calendar/CalendarRoot";
import EventsNavBar from "@/checkpoint/components/event/EventsNavBar";
import { JSX } from "react";

export default function Page(): JSX.Element {
  return (
    <>
      <EventsNavBar />
      <MyCalendarContent />
    </>
  );
}

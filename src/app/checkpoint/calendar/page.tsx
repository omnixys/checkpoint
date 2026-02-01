"use client";

import MyCalendarContent from "@/components/calendar/MyCalendarContent";
import EventsNavBar from "@/components/eventList/EventsNavBar";
import { JSX } from "react";

export default function Page(): JSX.Element {
  return (
    <>
      <EventsNavBar />
      <MyCalendarContent />
    </>
  );
}

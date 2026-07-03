import type { Metadata } from "next";
import type { JSX } from "react";
import MyCalendarContent from "@/checkpoint/components/calendar/CalendarRoot";
import EventsNavBar from "@/checkpoint/components/event/EventsNavBar";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";

export const metadata: Metadata = buildMetadata({
  title: "Event Calendar",
  description: "Browse and manage your upcoming events.",

  page: "calendar",

  /**
   * Default: do NOT index calendar views
   */
  robots: {
    index: false,
    follow: false,
  },

  disableOpenGraph: true,
});

export default function Page(): JSX.Element {
  return (
    <>
      <EventsNavBar />
      <MyCalendarContent />
    </>
  );
}

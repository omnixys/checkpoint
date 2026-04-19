import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import EventsPageClient from "./EventsPageClient";
import { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "My Events",
  description: "View and manage your accessible events.",

  page: "event-list",

  /**
   * CRITICAL:
   * Prevent indexing and crawling
   */
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },

  /**
   * Disable OpenGraph
   * → prevents leaking event data via previews
   */
  disableOpenGraph: true,
});

export default async function EventsPage() {
  return <EventsPageClient />;
}

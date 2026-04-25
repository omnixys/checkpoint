import { Suspense } from "react";
import EventClientPage from "./EventClientPage";
import { Skeleton } from "@mui/material";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import { Metadata } from "next";


/**
 * -------------------------------------------------------------
 * Event Page Metadata (Dynamic SEO Core)
 * -------------------------------------------------------------
 * WHY:
 * - Public event page
 * - Needs SEO + Social Sharing
 * - Fully dynamic per event
 * -------------------------------------------------------------
 */
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const eventId = params?.id;

  /**
   * -------------------------------------------------------------
   * Fetch Event Data (SSR)
   * -------------------------------------------------------------
   */
  const event = await getEventMetadata(eventId);

  /**
   * Fallback (event not found)
   */
  if (!event) {
    return buildMetadata({
      title: "Event not found",
      description: "This event does not exist or is no longer available.",
      page: "event-detail",

      robots: {
        index: false,
        follow: false,
      },
    });
  }

  /**
   * -------------------------------------------------------------
   * SEO + OG
   * -------------------------------------------------------------
   */
  return buildMetadata({
    title: event.name,
    description:
      event.description ??
      `Join ${event.name} and secure your access.`,

    page: "event-detail",

    /**
     * PUBLIC → index allowed
     */
    robots: {
      index: true,
      follow: true,
    },

    /**
     * OpenGraph → CRITICAL
     */
    openGraph: {
      title: event.name,
      description:
        event.description ??
        "Join this event now.",
      image: event.ogImage,
    },
  });
}

/**
 * -------------------------------------------------------------
 * Replace with real data source
 * -------------------------------------------------------------
 */
async function getEventMetadata(eventId: string) {
  // TODO: Prisma / GraphQL call

  return {
    name: "Summer Gala 2026",
    description:
      "An exclusive evening event with VIP access, live music, and premium experience.",
    ogImage: `/api/og?eventId=${eventId}`,
  };
}
export default function EventPage() { 
  return (
    <Suspense
      fallback={<Skeleton variant="rectangular" width="100%" height="100vh" />}
    >
      <EventClientPage />
    </Suspense>
  );
}
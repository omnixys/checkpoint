"use client";

import dynamic from "next/dynamic";

/**
 * Leaflet MUST be client-side only
 */
const EventLocationMapClient = dynamic(() => import("./EventLocationMapClient"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 300,
        borderRadius: 24,
        background: "#111",
      }}
    />
  ),
});

export default function EventLocationMap(props: { eventId: string }) {
  return <EventLocationMapClient {...props} />;
}

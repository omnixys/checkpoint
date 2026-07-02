import React, { JSX, Suspense } from "react";
import { Skeleton } from "@mui/material";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import { Metadata } from "next";
import SeatMapClientPage from "@/checkpoint/app/(protected)/event/[id]/seat/map/SeatMapClientPage";

export const metadata: Metadata = buildMetadata({
  title: "Sitzplan",
  description: "Interaktiver Sitzplan mit Live-Präsenz.",
  page: "event-seat-map",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  disableOpenGraph: true,
});

export default function SeatMapPage(): JSX.Element {
  return (
    <Suspense fallback={<Skeleton variant="rectangular" width="100%" height="80vh" />}>
      <SeatMapClientPage />
    </Suspense>
  );
}

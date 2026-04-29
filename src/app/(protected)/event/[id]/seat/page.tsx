import React, { JSX, Suspense } from "react";
import { Skeleton } from "@mui/material";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import { Metadata } from "next";
import TicketClientPage from "@/checkpoint/app/(protected)/event/[id]/ticket/TicketClientPage";
import SeatsClientPage from "@/checkpoint/app/(protected)/event/[id]/seat/SeatClientPage";

export const metadata = buildMetadata({
  title: "Seating Plan",
  description: "Manage seating and layout.",

  page: "event-seats",

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },

  disableOpenGraph: true,
});

export default function SeatPage(): JSX.Element {
  return (
    <Suspense fallback={<Skeleton variant="rectangular" width={210} height={118} />}>
      <SeatsClientPage />
    </Suspense>
  );
}

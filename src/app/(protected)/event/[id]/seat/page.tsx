import { Skeleton } from "@mui/material";
import { type JSX, Suspense } from "react";
import SeatsClientPage from "@/checkpoint/app/(protected)/event/[id]/seat/SeatClientPage";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";

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

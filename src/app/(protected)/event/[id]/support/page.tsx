import { Skeleton } from "@mui/material";
import { type JSX, Suspense } from "react";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import EventSupportClientPage from "./EventSupportClientPage";

export const metadata = buildMetadata({
  title: "Event Support",
  description: "Manage guest support conversations.",
  page: "event-support",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  disableOpenGraph: true,
});

export default function EventSupportPage(): JSX.Element {
  return (
    <div
      style={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        paddingTop: "2rem",
      }}
    >
      <Suspense fallback={<Skeleton variant="rectangular" width={210} height={118} />}>
        <EventSupportClientPage />
      </Suspense>
    </div>
  );
}

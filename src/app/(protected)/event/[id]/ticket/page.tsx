import { Skeleton } from "@mui/material";
import { type JSX, Suspense } from "react";
import TicketClientPage from "@/checkpoint/app/(protected)/event/[id]/ticket/TicketClientPage";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";

export const metadata = buildMetadata({
  title: "Tickets",
  description: "View and manage issued tickets.",

  page: "event-tickets",

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },

  disableOpenGraph: true,
});

export default function TicketPage(): JSX.Element {
  return (
    <>
      {/* <AppleNavBar title="Login" /> */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          paddingTop: "2rem",
        }}
      >
        <Suspense fallback={<Skeleton variant="rectangular" width={210} height={118} />}>
          <TicketClientPage />
        </Suspense>
      </div>
    </>
  );
}

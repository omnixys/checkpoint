import { Skeleton } from "@mui/material";
import type { Metadata } from "next";
import { type JSX, Suspense } from "react";
import EventNotificationClientPage from "@/checkpoint/app/(protected)/event/[id]/notification/EventNotificationClientPage";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";

export const metadata: Metadata = buildMetadata({
  title: "Notifications",
  description: "Manage event messages and communications.",

  page: "event-notifications",

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },

  disableOpenGraph: true,
});

export default function EventNotificationPage(): JSX.Element {
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
          <EventNotificationClientPage />
        </Suspense>
      </div>
    </>
  );
}

import React, { JSX, Suspense } from "react";
import { Skeleton } from "@mui/material";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import { Metadata } from "next";
import EventNotificationClientPage from "@/checkpoint/app/(protected)/event/[id]/notification/EventNotificationClientPage";

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

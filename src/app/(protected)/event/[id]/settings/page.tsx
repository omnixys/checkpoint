import React, { JSX, Suspense } from "react";
import { Skeleton } from "@mui/material";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import { Metadata } from "next";
import TicketClientPage from "@/checkpoint/app/(protected)/event/[id]/ticket/TicketClientPage";
import EventSettingsClientPage from "@/checkpoint/app/(protected)/event/[id]/settings/EventSettingsClientPage";

export const metadata = buildMetadata({
  title: "Event Settings",
  description: "Configure and manage event settings.",

  page: "event-settings",

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },

  disableOpenGraph: true,
});

export default function EventSettingsPage(): JSX.Element {
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
          <EventSettingsClientPage />
        </Suspense>
      </div>
    </>
  );
}

import { Skeleton } from "@mui/material";
import { type JSX, Suspense } from "react";
import EventSettingsClientPage from "@/checkpoint/app/(protected)/event/[id]/settings/EventSettingsClientPage";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";

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

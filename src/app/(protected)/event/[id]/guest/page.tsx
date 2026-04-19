import React, { JSX, Suspense } from "react";
import { Skeleton } from "@mui/material";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import { Metadata } from "next";
import GuestListClientPage from "@/checkpoint/app/(protected)/event/[id]/guest/GuestListClientPage";

export const metadata = buildMetadata({
  title: "Guest Management",
  description: "Manage event guests and attendance.",

  page: "event-guests",

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },

  disableOpenGraph: true,
});

export default function GuestListPage(): JSX.Element {
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
        <Suspense
          fallback={<Skeleton variant="rectangular" width={210} height={118} />}
        >
          <GuestListClientPage />
        </Suspense>
      </div>
    </>
  );
}

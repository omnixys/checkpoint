import React, { JSX, Suspense } from "react";
import { Skeleton } from "@mui/material";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import { Metadata } from "next";
import SecurityDashboardClientPage from "@/checkpoint/app/(protected)/event/[id]/security/SecurityDashboardClientPage";

export const metadata: Metadata = buildMetadata({
  title: "Security Dashboard",
  description: "Monitor scans and security activity.",

  page: "event-security",

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },

  disableOpenGraph: true,
});

export default function SecurityDashboardPage(): JSX.Element {
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
          <SecurityDashboardClientPage />
        </Suspense>
      </div>
    </>
  );
}

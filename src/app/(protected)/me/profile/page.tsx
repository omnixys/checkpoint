"use client";

import ProfileClientPage from "@/checkpoint/app/(protected)/me/profile/ProfilePage";
import ChangePasswordClient from "@/checkpoint/app/(protected)/me/security/ChangePasswordClient";
import MySeatClientPage from "@/checkpoint/app/(protected)/my-seat/MySeatPageClient";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import { Box, Skeleton } from "@mui/material";
import { Metadata } from "next";
import { JSX, Suspense } from "react";


export const metadata: Metadata = buildMetadata({
  title: "Profile Settings",
  description: "Update your personal profile information.",

  page: "me-profile",

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },

  disableOpenGraph: true,
});

/**
 * Guest-facing page that shows the assigned seat
 * for the currently active event.
 *
 * Event context is resolved via ActiveEventProvider.
 */
export default function SecurityPage(): JSX.Element {
  return (
    <Box
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
        <ProfileClientPage />
      </Suspense>
    </Box>
  );
}

import { Box, Skeleton } from "@mui/material";
import type { Metadata } from "next";
import { type JSX, Suspense } from "react";
import ChangePasswordClient from "@/checkpoint/app/(protected)/me/security/ChangePasswordClient";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";

export const metadata: Metadata = buildMetadata({
  title: "Security Settings",
  description: "Manage your account security and password.",

  page: "me-security",

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
      <Suspense fallback={<Skeleton variant="rectangular" width={210} height={118} />}>
        <ChangePasswordClient />
      </Suspense>
    </Box>
  );
}

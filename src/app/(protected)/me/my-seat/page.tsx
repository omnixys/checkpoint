import MySeatClientPage from "@/checkpoint/app/(protected)/me/my-seat/MySeatPageClient";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import { Box, Skeleton } from "@mui/material";
import { Metadata } from "next";
import { JSX, Suspense } from "react";

export const metadata: Metadata = buildMetadata({
  title: "My Seat",
  description: "View your assigned seat for the event.",

  page: "my-seat",

  /**
   * CRITICAL:
   * Prevent indexing and crawling
   */
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },

  /**
   * Disable OpenGraph completely
   * → prevents accidental sharing previews
   */
  disableOpenGraph: true,
});

/**
 * Guest-facing page that shows the assigned seat
 * for the currently active event.
 *
 * Event context is resolved via ActiveEventProvider.
 */
export default function MySeatPage(): JSX.Element {
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
        <MySeatClientPage />
      </Suspense>
    </Box>
  );
}

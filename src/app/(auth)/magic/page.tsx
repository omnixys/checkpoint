import { Box, Skeleton } from "@mui/material";
import { type JSX, Suspense } from "react";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import MagicLinkPageClient from "./MagicLinkPageClient";

export const metadata = buildMetadata({
  title: "Guest sign-in",
  description: "Secure guest sign-in for Checkpoint.",
  page: "magic",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Guest sign-in",
    description: "Secure guest sign-in for Checkpoint.",
  },
});

export default function MagicLinkPage(): JSX.Element {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        minHeight: "100svh",
        p: 3,
      }}
    >
      <Suspense fallback={<Skeleton variant="rounded" width="100%" height={220} />}>
        <MagicLinkPageClient />
      </Suspense>
    </Box>
  );
}

import { Box, Skeleton } from "@mui/material";
import type { Metadata } from "next";
import { Suspense } from "react";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import RequestGuestConfirmationClient from "./RequestGuestConfirmationClient";

export const metadata: Metadata = buildMetadata({
  title: "Request confirmation link",
  description: "Request a new secure guest confirmation link.",
  page: "request-guest-confirmation",
  robots: { index: false, follow: false },
});

export default function RequestGuestConfirmationPage() {
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
      <Suspense fallback={<Skeleton variant="rounded" width="100%" height={360} />}>
        <RequestGuestConfirmationClient />
      </Suspense>
    </Box>
  );
}

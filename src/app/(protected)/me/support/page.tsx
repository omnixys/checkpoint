import { Box, Skeleton } from "@mui/material";
import type { Metadata } from "next";
import { type JSX, Suspense } from "react";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import SupportChatPageClient from "./SupportChatPageClient";

export const metadata: Metadata = buildMetadata({
  title: "Support Chat",
  description: "Contact support and view your conversation history.",
  page: "me-support",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  disableOpenGraph: true,
});

export default function SupportPage(): JSX.Element {
  return (
    <Box sx={{ width: "100%" }}>
      <Suspense
        fallback={<Skeleton variant="rounded" width="100%" height={540} sx={{ borderRadius: 2 }} />}
      >
        <SupportChatPageClient />
      </Suspense>
    </Box>
  );
}

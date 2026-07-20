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
    <Box
      style={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        paddingTop: "2rem",
        minHeight: "60vh",
      }}
    >
      <Suspense fallback={<Skeleton variant="rectangular" width={210} height={118} />}>
        <SupportChatPageClient />
      </Suspense>
    </Box>
  );
}

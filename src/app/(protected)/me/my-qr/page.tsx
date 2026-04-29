import QrClientPage from "@/checkpoint/app/(protected)/me/my-qr/QrClientPage";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import { Skeleton } from "@mui/material";
import { Suspense } from "react";

export const metadata = buildMetadata({
  title: "My Ticket",
  description: "Your secure access pass for the event.",

  page: "my-qr",

  /**
   * CRITICAL:
   * Completely block indexing & caching
   */
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },

  /**
   * Disable OpenGraph entirely
   */
  disableOpenGraph: true,
});

export default function QRPage() {
  return (
    <Suspense
      fallback={<Skeleton variant="rectangular" width="100%" height="100vh" />}
    >
      <QrClientPage />
    </Suspense>
  );
}

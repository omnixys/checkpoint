import { Skeleton } from "@mui/material";
import { Suspense } from "react";
import ScannerClientPage from "@/checkpoint/app/(protected)/scan/ScannerClientPage";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";

export const metadata = buildMetadata({
  title: "QR Scanner",
  description: "Scan QR codes to validate guest access and track entry status.",

  page: "scan",

  /**
   * CRITICAL:
   * Never index scanner pages
   */
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },

  /**
   * OpenGraph intentionally disabled
   * → no preview when shared
   */
  disableOpenGraph: true,
});

export default function ScannerPage() {
  return (
    <Suspense fallback={<Skeleton variant="rectangular" width="100%" height="100vh" />}>
      <ScannerClientPage />
    </Suspense>
  );
}

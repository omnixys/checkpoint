import { Skeleton } from "@mui/material";
import { type JSX, Suspense } from "react";
import { CommunicationWorkspaceClientPage } from "@/checkpoint/components/communication/CommunicationWorkspaceClientPage";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";

export const metadata = buildMetadata({
  title: "Event Support",
  description: "Manage guest support conversations.",
  page: "event-support",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  disableOpenGraph: true,
});

export default function EventSupportPage(): JSX.Element {
  return (
    <div style={{ display: "flex", flexGrow: 1, minHeight: 0, width: "100%" }}>
      <Suspense fallback={<Skeleton variant="rectangular" width={210} height={118} />}>
        <CommunicationWorkspaceClientPage workspace="support" />
      </Suspense>
    </div>
  );
}

import { Skeleton } from "@mui/material";
import type { Metadata } from "next";
import { type JSX, Suspense } from "react";
import { CommunicationWorkspaceClientPage } from "@/checkpoint/components/communication/CommunicationWorkspaceClientPage";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";

export const metadata: Metadata = buildMetadata({
  title: "Event Support",
  description: "Manage guest support conversations.",
  page: "event-support-conversation",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  disableOpenGraph: true,
});

export default async function EventSupportConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}): Promise<JSX.Element> {
  const { conversationId } = await params;
  return (
    <div style={{ display: "flex", flexGrow: 1, minHeight: 0, width: "100%" }}>
      <Suspense fallback={<Skeleton variant="rectangular" width={210} height={118} />}>
        <CommunicationWorkspaceClientPage
          workspace="support"
          deepLinkConversationId={conversationId}
        />
      </Suspense>
    </div>
  );
}

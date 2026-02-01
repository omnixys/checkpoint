"use client";

import RsvpContainer from "@/components/rsvp/RsvpContainer";
import { getLogger } from "@/components/../utils/logger";
import { useParams } from "next/navigation";

/**
 * Main RSVP Page Entry
 * - Extracts invitationId from URL
 * - Delegates all logic/UI to <RsvpContainer />
 */
export default function RsvpPage() {
  const logger = getLogger("RsvpPage");

  const { invId } = useParams<{ invId: string }>();

  logger.debug({ invId });

  // SSR/CSR Guard
  if (!invId) {
    return (
      <div
        style={{
          padding: "64px",
          textAlign: "center",
          fontSize: "1.2rem",
        }}
      >
        Ungültiger Link – es wurde keine invitationId übergeben.
      </div>
    );
  }

  return <RsvpContainer invitationId={invId} />;
}

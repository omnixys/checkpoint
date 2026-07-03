"use client";

import InvitationBulkBar from "@/checkpoint/components/invitation/InvitationBulkBar";
import InvitationCardView from "@/checkpoint/components/invitation/InvitationCardView";
import InvitationTable from "@/checkpoint/components/invitation/InvitationTable";
import type { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";

/* ---------------------------------------------------------------------------
 * Content Layer
 * - Switch between Table / Cards
 * ------------------------------------------------------------------------- */
export default function InvitationContent({
  logic,
  isMobile,
}: {
  logic: InvitationLogic;
  isMobile: boolean;
}) {
  return (
    <>
      {/* LIST */}
      {isMobile ? <InvitationCardView logic={logic} /> : <InvitationTable logic={logic} />}

      {/* BULK BAR */}
      <InvitationBulkBar logic={logic} />
    </>
  );
}

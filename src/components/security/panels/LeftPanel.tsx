"use client";

import { Stack } from "@mui/material";
import GateOverviewHeatmap from "@/checkpoint/components/security/GateOverviewHeatmap";
import SecurityQuickToolsPanel from "@/checkpoint/components/security/SecurityQuickToolsPanel";
import TicketVerificationTool from "@/checkpoint/components/security/TicketVerificationTool";
import type { GateTrendType, VerdictType } from "@/checkpoint/types/security.typa";

// Imported components (from previous phases)

/* -----------------------------------------------------------------------
 * LeftPanel
 * - Contains Gate heatmap, verification tool and quick security actions
 * - Desktop: left side (25%)
 * - Tablet: top-left section
 * - Mobile: will be stacked in the main page
 * ----------------------------------------------------------------------- */
export default function LeftPanel({
  gates,
  onTicketVerify,
  tools,
}: {
  gates: {
    id: string;
    name: string;
    scans: number;
    warnings: number;
    trend: GateTrendType;
  }[];

  onTicketVerify: (ticketId: string) => Promise<{
    verdict: VerdictType;
    message: string;
  }>;

  tools: {
    onSearch: () => void;
    onRevoke: () => void;
    onMark: () => void;
    onGateOpen: () => void;
    onGateClose: () => void;
  };
}) {
  return (
    <Stack spacing={3}>
      {/* Gate Load Overview */}
      <GateOverviewHeatmap gates={gates} />

      {/* Manual Ticket Verification */}
      <TicketVerificationTool onVerify={onTicketVerify} />

      {/* Quick Tools */}
      <SecurityQuickToolsPanel {...tools} />
    </Stack>
  );
}

"use client";

import { Stack } from "@mui/material";

// Imported components (from previous phases)
import GateOverviewHeatmap from "@/components/security/GateOverviewHeatmap";
import SecurityQuickToolsPanel from "@/components/security/SecurityQuickToolsPanel";
import TicketVerificationTool from "@/components/security/TicketVerificationTool";

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
    trend: "low" | "medium" | "high";
  }[];

  onTicketVerify: (ticketId: string) => Promise<{
    verdict: "OK" | "WARNING" | "DENIED";
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

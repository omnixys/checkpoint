"use client";

import { Stack } from "@mui/material";

// Phase 3 components
import EntryExitHistory from "@/components/security/EntryExitHistory";
import GuestsInsideList from "@/components/security/GuestsInsideList";
import SecurityAnalyticsCharts from "@/components/security/SecurityAnalyticsCharts";

/* -----------------------------------------------------------------------
 * RightPanel
 * - Contains guest overview + entry/exit logs + analytics charts
 * - Desktop: right side (25%)
 * - Tablet: below live feed
 * ----------------------------------------------------------------------- */
export default function RightPanel({
  guestsInside,
  entries,
  exits,
  analytics,
}: {
  guestsInside: {
    id: string;
    name: string;
    seat?: string;
    timeIn: string;
  }[];

  entries: { id: string; name: string; seat?: string; time: string }[];
  exits: { id: string; name: string; seat?: string; time: string }[];

  analytics: {
    scans: { time: string; value: number }[];
    warnings: { time: string; value: number }[];
  };
}) {
  return (
    <Stack spacing={3}>
      {/* Who is currently inside */}
      <GuestsInsideList guests={guestsInside} />

      {/* Recent entry / exit logs */}
      <EntryExitHistory entries={entries} exits={exits} />

      {/* Charts */}
      <SecurityAnalyticsCharts
        scans={analytics.scans}
        warnings={analytics.warnings}
      />
    </Stack>
  );
}

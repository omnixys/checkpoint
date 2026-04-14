"use client";

import SecurityAlertsRow from "@/checkpoint/components/security/SecurityAlertsRow";
import SecurityConnectivityBadge from "@/checkpoint/components/security/SecurityConnectivityBadge";
import SecurityLiveFeed from "@/checkpoint/components/security/SecurityLiveFeed";
import SecurityStatusHeader from "@/checkpoint/components/security/SecurityStatusHeader";
import { Stack } from "@mui/material";

// Phase 1 components

/* -----------------------------------------------------------------------
 * CenterPanel
 * - The main operational area of the Security Dashboard
 * - Contains: status, connectivity, alerts, live feed
 * - Desktop: center (50%)
 * - Tablet: right side
 * ----------------------------------------------------------------------- */
export default function CenterPanel({
  status,
  connectivity,
  alerts,
  feed,
}: {
  status: { inside: number; outside: number; scans: number; alerts: number };
  connectivity: { ws: boolean; kafka: boolean; api: boolean };
  alerts: { id: string; message: string; severity: "warn" | "critical" }[];
  feed: {
    id: string;
    name: string;
    seat: string;
    gate: string;
    verdict: "OK" | "WARNING" | "DENIED";
    time: string;
  }[];
}) {
  return (
    <Stack spacing={3}>
      <SecurityStatusHeader {...status} />

      <SecurityConnectivityBadge {...connectivity} />

      <SecurityAlertsRow alerts={alerts} />

      <SecurityLiveFeed feed={feed} />
    </Stack>
  );
}

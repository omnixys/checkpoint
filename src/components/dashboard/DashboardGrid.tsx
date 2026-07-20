"use client";

import { Box, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { getWidgets } from "@/checkpoint/lib/experience/widget-registry";
import { resolveExperience } from "@/checkpoint/lib/experience/resolver";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import TicketQRWidget from "./widgets/TicketQRWidget";
import GuestStatsWidget from "./widgets/GuestStatsWidget";
import ScannerQuickWidget from "./widgets/ScannerQuickWidget";
import SecurityStatusWidget from "./widgets/SecurityStatusWidget";
import SupportQueueWidget from "./widgets/SupportQueueWidget";
import QuickActionsWidget from "./widgets/QuickActionsWidget";
import EventMetaWidget from "./widgets/EventMetaWidget";
import ScanActivityWidget from "./widgets/ScanActivityWidget";

const WIDGET_MAP: Record<string, () => React.ReactElement | null> = {
  "ticket-qr": TicketQRWidget,
  "guest-stats": GuestStatsWidget,
  "scanner-quick": ScannerQuickWidget,
  "security-status": SecurityStatusWidget,
  "support-queue": SupportQueueWidget,
  "quick-actions": QuickActionsWidget,
  "event-meta": EventMetaWidget,
  "scan-activity": ScanActivityWidget,
};

export default function DashboardGrid() {
  const { myRoles, myPermissions } = useActiveEvent();

  const widgetDefs = useMemo(() => {
    const roleIds = myRoles.map((r) => r.key);
    const experience = resolveExperience(roleIds, myPermissions);
    return getWidgets(experience.dashboardWidgetIds as any[]);
  }, [myRoles, myPermissions]);

  if (widgetDefs.length === 0) return null;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: "0.95rem" }}>
        Dashboard
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: 2,
        }}
      >
        {widgetDefs.map((def) => {
          const Widget = WIDGET_MAP[def.id];
          if (!Widget) return null;
          return (
            <Box
              key={def.id}
              sx={{ gridColumn: `span ${def.width}` }}
            >
              <Widget />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

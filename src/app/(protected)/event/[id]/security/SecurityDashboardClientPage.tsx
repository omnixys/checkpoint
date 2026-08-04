"use client";

import { Box, Grid, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { type JSX } from "react";
import RouteGuard from "@/checkpoint/components/guard/RouteGuard";
import { mockAlerts } from "@/checkpoint/components/security/mock/mockAlerts";
import { mockConnectivity } from "@/checkpoint/components/security/mock/mockConnectivity";
import { mockEntries, mockExits } from "@/checkpoint/components/security/mock/mockEntries";
import { mockFeed } from "@/checkpoint/components/security/mock/mockFeed";
import { mockGates } from "@/checkpoint/components/security/mock/mockGates";
import { mockGuestsInside } from "@/checkpoint/components/security/mock/mockGuestsInside";
import { mockStatus } from "@/checkpoint/components/security/mock/mockStatus";
import { mockTools } from "@/checkpoint/components/security/mock/mockTools";
import { mockVerifyTicket } from "@/checkpoint/components/security/mock/mockVerifyTicket";
import CenterPanel from "@/checkpoint/components/security/panels/CenterPanel";
import LeftPanel from "@/checkpoint/components/security/panels/LeftPanel";
import RightPanel from "@/checkpoint/components/security/panels/RightPanel";
import SecurityTabs from "@/checkpoint/components/security/SecurityTabs";
import VisionOsStickyHeader from "@/checkpoint/components/security/VisionOSStickyHeader";
import { BackToEventDetailButton } from "@/checkpoint/components/utils/back-to-event-detail-button";
import { useAnalyticsSecurityCharts } from "@/checkpoint/hooks/analytics/useAnalyticsSecurityCharts";
import { useDevice } from "@/checkpoint/providers/DeviceProvider";

/* ------------------------------------------------------------------
 * Main Security Dashboard Page
 * - Fully responsive for Desktop / Tablet / Mobile
 * - VisionOS glass layout
 * ------------------------------------------------------------------ */

export default function SecurityDashboardClientPage(): JSX.Element {
  const _theme = useTheme();
  const { isTablet, isMobile, isDesktop } = useDevice();
  const [tab, setTab] = React.useState("overview");
  const { scans, warnings } = useAnalyticsSecurityCharts();

  return (
    <RouteGuard featureId="security">
      <Box sx={{ p: isMobile ? 1.5 : 3, minWidth: 0 }}>
        <Stack spacing={3}>
          {/* Back Button */}
          <BackToEventDetailButton />

          {/* ==========================================================
           * DESKTOP LAYOUT (≥1200px)
           * ========================================================== */}
          {isDesktop && (
            <>
              <VisionOsStickyHeader connectivity={mockConnectivity} />

              <Grid container={true} spacing={3}>
                {/* LEFT PANEL */}
                <Grid size={{ xs: 12, lg: 3 }}>
                  <LeftPanel
                    gates={mockGates}
                    onTicketVerify={mockVerifyTicket}
                    tools={mockTools}
                  />
                </Grid>

                {/* CENTER PANEL */}
                <Grid size={{ xs: 12, lg: 6 }}>
                  <CenterPanel
                    status={mockStatus}
                    connectivity={mockConnectivity}
                    alerts={mockAlerts}
                    feed={mockFeed}
                  />
                </Grid>

                {/* RIGHT PANEL */}
                <Grid size={{ xs: 12, lg: 3 }}>
                  <RightPanel
                    guestsInside={mockGuestsInside}
                    entries={mockEntries}
                    exits={mockExits}
                    analytics={{ scans, warnings }}
                  />
                </Grid>
              </Grid>
            </>
          )}

          {/* ---------------------------------------------------
           * TABLET / MOBILE → STICKY TAB NAVIGATION
           * --------------------------------------------------- */}
          {(isTablet || isMobile) && (
            <Box sx={{ pb: isMobile ? 5 : 0 }}>
              <SecurityTabs onChange={(t) => setTab(t)} />

              {tab === "overview" && (
                <CenterPanel
                  status={mockStatus}
                  connectivity={mockConnectivity}
                  alerts={mockAlerts}
                  feed={mockFeed}
                />
              )}

              {tab === "gates" && (
                <LeftPanel gates={mockGates} onTicketVerify={mockVerifyTicket} tools={mockTools} />
              )}

              {tab === "guests" && (
                <RightPanel
                  guestsInside={mockGuestsInside}
                  entries={mockEntries}
                  exits={mockExits}
                  analytics={{ scans, warnings }}
                />
              )}

              {tab === "analytics" && (
                <RightPanel
                  guestsInside={[]}
                  entries={[]}
                  exits={[]}
                  analytics={{ scans, warnings }}
                />
              )}
            </Box>
          )}
        </Stack>
      </Box>
    </RouteGuard>
  );
}

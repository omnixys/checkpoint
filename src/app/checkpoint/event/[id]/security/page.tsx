"use client";

import BackToEventDetail from "@/components/invitationList/button/BackToEventDetail";
import { mockAlerts } from "@/components/security/mock/mockAlerts";
import { mockConnectivity } from "@/components/security/mock/mockConnectivity";
import {
  mockEntries,
  mockExits,
} from "@/components/security/mock/mockEntries";
import { mockFeed } from "@/components/security/mock/mockFeed";
import { mockGates } from "@/components/security/mock/mockGates";
import { mockGuestsInside } from "@/components/security/mock/mockGuestsInside";
import { mockScanAnalytics } from "@/components/security/mock/mockScanAnalytics";
import { mockStatus } from "@/components/security/mock/mockStatus";
import { mockTools } from "@/components/security/mock/mockTools";
import { mockVerifyTicket } from "@/components/security/mock/mockVerifyTicket";
import { mockWarningAnalytics } from "@/components/security/mock/mockWarningAnalytics";
import CenterPanel from "@/components/security/panels/CenterPanel";
import LeftPanel from "@/components/security/panels/LeftPanel";
import RightPanel from "@/components/security/panels/RightPanel";
import SecurityTabs from "@/components/security/SecurityTabs";
import VisionOSStickyHeader from "@/components/security/VisionOSStickyHeader";
import { useDevice } from "@/providers/DeviceProvider";
import { Box, Grid, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import React, { JSX } from "react";
import { useAuth } from "@/providers/AuthProvider";

/* ------------------------------------------------------------------
 * Main Security Dashboard Page
 * - Fully responsive for Desktop / Tablet / Mobile
 * - VisionOS glass layout
 * ------------------------------------------------------------------ */

export default function SecurityDashboardPage(): JSX.Element {
  const theme = useTheme();
  const { isTablet, isMobile, isDesktop } = useDevice();
  const [tab, setTab] = React.useState("overview");

      const router = useRouter();
        const { isAuthenticated } = useAuth();

      if (!isAuthenticated) {
        router.push("/checkpoint/");
      }
  
  return (
    <Box sx={{ p: isMobile ? 1.5 : 3 }}>
      <Stack spacing={3}>
        {/* Back Button */}
        <BackToEventDetail />

        {/* ==========================================================
         * DESKTOP LAYOUT (≥1200px)
         * ========================================================== */}
        {isDesktop && (
          <>
            <VisionOSStickyHeader connectivity={mockConnectivity} />

            <Grid container spacing={3}>
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
                  analytics={{
                    scans: mockScanAnalytics,
                    warnings: mockWarningAnalytics,
                  }}
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
              <LeftPanel
                gates={mockGates}
                onTicketVerify={mockVerifyTicket}
                tools={mockTools}
              />
            )}

            {tab === "guests" && (
              <RightPanel
                guestsInside={mockGuestsInside}
                entries={mockEntries}
                exits={mockExits}
                analytics={{
                  scans: mockScanAnalytics,
                  warnings: mockWarningAnalytics,
                }}
              />
            )}

            {tab === "analytics" && (
              <RightPanel
                guestsInside={[]}
                entries={[]}
                exits={[]}
                analytics={{
                  scans: mockScanAnalytics,
                  warnings: mockWarningAnalytics,
                }}
              />
            )}
          </Box>
        )}
      </Stack>
    </Box>
  );
}

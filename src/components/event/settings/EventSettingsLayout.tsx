"use client";

import { Tabs, Tab, Box, Stack } from "@mui/material";
import { useState } from "react";

type TabKey = "meta" | "settings" | "timeline" | "roles" | "address";

/**
 * Layout wrapper using tabs
 *
 * Clean separation of sections
 */
export default function EventSettingsLayout({
  sections,
}: {
  sections: Record<TabKey, React.ReactNode>;
}) {
  const [tab, setTab] = useState<TabKey>("meta");

  return (
    <Stack spacing={2}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable">
        <Tab value="meta" label="Event" />
        <Tab value="settings" label="Settings" />
        <Tab value="timeline" label="Timeline" />
        <Tab value="roles" label="Roles" />
        <Tab value="address" label="Address" />
      </Tabs>

      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          backdropFilter: "blur(20px)",
          background: "rgba(255,255,255,0.04)",
        }}
      >
        {sections[tab]}
      </Box>
    </Stack>
  );
}

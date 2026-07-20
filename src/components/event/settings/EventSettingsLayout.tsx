"use client";

import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { alpha, Box, IconButton, Stack, Tab, Tabs, Tooltip, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

type TabKey = "meta" | "settings" | "timeline" | "roles" | "tabs" | "address" | "seatColors";

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
  const theme = useTheme();
  const params = useParams();
  const id = params?.id;

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Stack
        spacing={1.5}
        direction={{ xs: "column", md: "row" }}
        sx={{
          alignItems: { xs: "stretch", md: "center" },
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.72),
          boxShadow: theme.palette.mode === "dark" ? "none" : "0 14px 40px rgba(15,23,42,0.08)",
          p: 1,
        }}
      >
        <Link href={`/event/${id}`} passHref={true}>
          <Tooltip title="Zurück zum Event">
            <motion.div
              transition={{ duration: 0.25, ease: "easeInOut" }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton>
                <ArrowCircleLeftIcon fontSize="large" color="primary" />
              </IconButton>
            </motion.div>
          </Tooltip>
        </Link>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            flex: 1,
            minHeight: 44,
            "& .MuiTabs-indicator": { display: "none" },
            "& .MuiTab-root": {
              borderRadius: 2,
              minHeight: 40,
              mx: 0.25,
              textTransform: "none",
            },
            "& .Mui-selected": {
              backgroundColor: alpha(theme.palette.primary.main, 0.12),
            },
          }}
        >
          <Tab value="meta" label="Event" />
          <Tab value="settings" label="Settings" />
          <Tab value="timeline" label="Timeline" />
          <Tab value="roles" label="Permissions & Roles" />
          <Tab value="tabs" label="Tabs" />
          <Tab value="seatColors" label="Seat Colors" />
          <Tab value="address" label="Address" />
        </Tabs>
      </Stack>

      <Box
        sx={{
          p: { xs: 2, md: 3 },
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          backdropFilter: "blur(20px)",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.04)"
              : alpha(theme.palette.background.paper, 0.76),
          boxShadow: theme.palette.mode === "dark" ? "none" : "0 18px 50px rgba(15,23,42,0.08)",
        }}
      >
        {sections[tab]}
      </Box>
    </Stack>
  );
}

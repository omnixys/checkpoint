"use client";

import { Tabs, Tab, Box, Stack, Tooltip, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { useParams } from "next/navigation";


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
    const params = useParams();
      const id = params?.id;

  return (
    <Stack spacing={2}>
      <Stack spacing={2} direction={'row'}>
        <Link href={`/event/${id}`} passHref>
          <Tooltip title={"Zurück zum Event"}>
            <motion.div
              transition={{ duration: 0.25, ease: "easeInOut" }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton>
                <ArrowCircleLeftIcon fontSize="large" color={"primary"} />
              </IconButton>
            </motion.div>
          </Tooltip>
        </Link>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable">
          <Tab value="meta" label="Event" />
          <Tab value="settings" label="Settings" />
          <Tab value="timeline" label="Timeline" />
          <Tab value="roles" label="Roles" />
          <Tab value="address" label="Address" />
        </Tabs>
      </Stack>

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

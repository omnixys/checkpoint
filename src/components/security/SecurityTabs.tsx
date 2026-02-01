"use client";

import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";
import { motion } from "framer-motion";
import VisionOSCompactHeader from "./VisionOSCompactHeader";
import { mockConnectivity } from "./mock/mockConnectivity";

/* --------------------------------------------------------------
 * VisionOS Premium Sticky Tabbar for Tablet & Mobile
 * -------------------------------------------------------------- */
export default function SecurityTabs({
  onChange,
}: {
  onChange: (tab: string) => void;
}) {
  const [value, setValue] = useState("overview");

  function handleChange(_: any, v: string) {
    setValue(v);
    onChange(v);
  }

  return (
    <motion.div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
      }}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
              <VisionOSCompactHeader connectivity={mockConnectivity} />
      <Box
        sx={{
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(22px)",
          borderRadius: "20px",
          px: 1,
          py: 0.5,
          mb: 2,
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          textColor="inherit"
          TabIndicatorProps={{
            sx: {
              height: "4px",
              borderRadius: "4px",
              background: "#007AFF",
            },
          }}
        >
          <Tab
            label="Overview"
            value="overview"
            sx={{ textTransform: "none" }}
          />
          <Tab label="Gates" value="gates" sx={{ textTransform: "none" }} />
          <Tab label="Guests" value="guests" sx={{ textTransform: "none" }} />
          <Tab
            label="Analytics"
            value="analytics"
            sx={{ textTransform: "none" }}
          />
        </Tabs>
      </Box>
    </motion.div>
  );
}

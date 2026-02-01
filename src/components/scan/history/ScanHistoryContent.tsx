"use client";

import { Box } from "@mui/material";
import HistoryFeed from "./HistoryFeed";
import LiveHeader from "./LiveHeader";

export default function ScanHistoryContent() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <LiveHeader />
      <HistoryFeed />
    </Box>
  );
}

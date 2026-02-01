"use client";

import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";

/* ------------------------------------------------------------
 * SecurityQuickToolsPanel
 * - Fast actions for security staff
 * - VisionOS button styling
 * ------------------------------------------------------------ */
export default function SecurityQuickToolsPanel({
  onSearch,
  onRevoke,
  onMark,
  onGateOpen,
  onGateClose,
}: {
  onSearch: () => void;
  onRevoke: () => void;
  onMark: () => void;
  onGateOpen: () => void;
  onGateClose: () => void;
}) {
  return (
    <Box
      sx={{
        px: 2.5,
        py: 2.5,
        backdropFilter: "blur(16px)",
        background: "rgba(255,255,255,0.22)",
        borderRadius: "24px",
      }}
    >
      <Typography fontSize="1.1rem" fontWeight={600} sx={{ mb: 2 }}>
        Security Tools
      </Typography>

      <Stack spacing={1.4}>
        <ToolButton label="Search Guest" onClick={onSearch} />
        <ToolButton label="Revoke Ticket" onClick={onRevoke} />
        <ToolButton label="Mark as Suspect" onClick={onMark} />
        <ToolButton label="Open Gate (Emergency)" onClick={onGateOpen} />
        <ToolButton label="Close Gate" onClick={onGateClose} />
      </Stack>
    </Box>
  );
}

function ToolButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.div whileTap={{ scale: 0.97 }}>
      <Button
        fullWidth
        variant="contained"
        onClick={onClick}
        sx={{
          py: 1.3,
          borderRadius: "18px",
          fontSize: "0.95rem",
          fontWeight: 600,
          textTransform: "none",
        }}
      >
        {label}
      </Button>
    </motion.div>
  );
}

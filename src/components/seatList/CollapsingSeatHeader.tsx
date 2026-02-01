"use client";

import { Box, Stack, Typography, useTheme, alpha } from "@mui/material";
import { motion } from "framer-motion";
import { useScrollHeader } from "./useScrollHeader";

export default function CollapsingSeatHeader() {
  const theme = useTheme();
  const scroll = useScrollHeader();

  return (
    <motion.div
      animate={{
        y: scroll.visible ? 0 : -70,
        height: scroll.collapsed ? 58 : 82,
      }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(18px)",
        background: alpha(theme.palette.background.default, 0.4),
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 3, height: "100%" }}
      >
        <Typography variant="h6" fontWeight={700}>
          Sitzplätze
        </Typography>

        {/* Rechts Ausklapp-Actions */}
      </Stack>
    </motion.div>
  );
}


"use client";

import { useActiveEvent } from "@/components/../providers/ActiveEventProvider";
import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

/* ---------------------------------------------------------------------
 * Animated Live Header for Scan History
 * ------------------------------------------------------------------- */
export default function LiveHeader() {
  const theme = useTheme();
  const { activeEvent } = useActiveEvent();

  const [toggle, setToggle] = React.useState(true);

  React.useEffect(() => {
    const id = setInterval(() => setToggle((v) => !v), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        py: 2,
        px: { xs: 2, sm: 3 },
        bgcolor: theme.palette.background.default + "CC",
        backdropFilter: "blur(24px)",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <AnimatePresence mode="wait">
        {toggle ? (
          <motion.div
            key="title"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
          >
            <Typography variant="h5" fontWeight={700}>
              Live Scan Verlauf
            </Typography>
            <Typography sx={{ opacity: 0.7 }}>
              Event: {activeEvent?.name}
            </Typography>
          </motion.div>
        ) : (
          <motion.div
            key="states"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
          >
            <Stack direction="row" spacing={1}>
              <Chip label="WS ✓" color="success" />
              <Chip label="Kafka ✓" color="success" />
              <Chip label="API ✓" color="success" />
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

"use client";

import { useActiveEvent } from "@/providers/ActiveEventProvider";
import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

/* ---------------------------------------------------------------------
 * Animated Header (VisionOS)
 * Switches between event title and live indicators
 * ------------------------------------------------------------------- */
export default function StatusHeader() {
  const theme = useTheme();
  const { activeEvent } = useActiveEvent();

  const [showTitle, setShowTitle] = React.useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setShowTitle((s) => !s);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(24px)",
        bgcolor: theme.palette.background.default + "CC",
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: 2,
        px: { xs: 2, sm: 3 },
      }}
    >
      <AnimatePresence mode="wait">
        {showTitle ? (
          <motion.div
            key="title"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ whiteSpace: "nowrap" }}
            >
              {activeEvent?.name}
            </Typography>
          </motion.div>
        ) : (
          <motion.div
            key="indicators"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
          >
            <Stack direction="row" spacing={1}>
              <Chip
                label="WS"
                sx={{
                  bgcolor: theme.palette.success.main + "22",
                  color: theme.palette.success.main,
                  fontWeight: 600,
                }}
              />
              <Chip
                label="Kafka"
                sx={{
                  bgcolor: theme.palette.success.main + "22",
                  color: theme.palette.success.main,
                  fontWeight: 600,
                }}
              />
              <Chip
                label="API"
                sx={{
                  bgcolor: theme.palette.success.main + "22",
                  color: theme.palette.success.main,
                  fontWeight: 600,
                }}
              />
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

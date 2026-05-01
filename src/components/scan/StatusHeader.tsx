"use client";

import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";

const LIVE_INDICATORS = ["websocket", "queue", "api"] as const;

export default function StatusHeader() {
  const theme = useTheme();
  const tScanner = useTypedTranslations("scanner");
  const { activeEvent } = useActiveEvent();
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setShowTitle((current) => !current);
    }, 3200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        px: { xs: 2, sm: 3 },
        py: 1.5,
        borderBottom: 1,
        borderColor: alpha(theme.palette.divider, 0.7),
        backgroundColor: alpha(theme.palette.background.default, 0.78),
        backdropFilter: "blur(24px) saturate(150%)",
        WebkitBackdropFilter: "blur(24px) saturate(150%)",
      }}
    >
      <AnimatePresence mode="wait">
        {showTitle ? (
          <motion.div
            key="title"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.32 }}
          >
            <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
              <ShieldRoundedIcon
                sx={{
                  width: theme.spacing(2.5),
                  height: theme.spacing(2.5),
                  color: theme.palette.primary.main,
                }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 800,
                    lineHeight: 1.15,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {activeEvent?.name ?? tScanner("header.noEvent")}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  {tScanner("header.subtitle")}
                </Typography>
              </Box>
            </Stack>
          </motion.div>
        ) : (
          <motion.div
            key="indicators"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.32 }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
              <SensorsRoundedIcon
                sx={{
                  width: theme.spacing(2.5),
                  height: theme.spacing(2.5),
                  color: theme.palette.success.main,
                }}
              />
              {LIVE_INDICATORS.map((indicator) => (
                <Chip
                  key={indicator}
                  label={tScanner(`header.live.${indicator}`)}
                  sx={{
                    color: theme.palette.success.main,
                    fontWeight: 700,
                    backgroundColor: alpha(theme.palette.success.main, 0.12),
                    border: 1,
                    borderColor: alpha(theme.palette.success.main, 0.24),
                  }}
                />
              ))}
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

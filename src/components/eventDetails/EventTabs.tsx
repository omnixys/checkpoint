"use client";

import React from "react";
import { Box, Stack, Typography, useTheme, alpha } from "@mui/material";
import { motion } from "framer-motion";

type Tab = {
  key: string;
  label: string;
};

const TABS: Tab[] = [
  // { key: "invitations", label: "Einladungen" },
  // { key: "tickets", label: "Tickets" },
  // { key: "logs", label: "Logs" },
  { key: "timeline", label: "Timeline" },
  // { key: "security", label: "Security" },
  { key: "settings", label: "Details" },
  { key: "location", label: "Maps" },
];

type Props = {
  active: string;
  onChange: (v: string) => void;
};

export default function EventTabs({ active, onChange }: Props) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "sticky",
        top: -40,
        zIndex: 5,
        backdropFilter: "blur(14px)",
        backgroundColor: alpha(theme.palette.background.paper, 0.5),
        borderRadius: "20px",
        px: 2,
        py: 1.2,
        boxShadow: theme.shadows[3],
      }}
    >
      <Stack direction="row" spacing={2}>
        {TABS.map((tab) => {
          const selected = active === tab.key;

          return (
            <Box
              key={tab.key}
              sx={{ position: "relative", cursor: "pointer" }}
              onClick={() => onChange(tab.key)}
            >
              <Typography
                sx={{
                  px: 1,
                  py: 0.4,
                  fontWeight: selected ? 700 : 500,
                  color: selected
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                  transition: "0.25s ease",
                }}
              >
                {tab.label}
              </Typography>

              {selected && (
                <motion.div
                  layoutId="event-tabs-underline"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: -4,
                    height: 3,
                    borderRadius: 3,
                    backgroundColor: theme.palette.primary.main,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}

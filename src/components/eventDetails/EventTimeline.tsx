"use client";

import React from "react";
import { Box, Stack, Typography, useTheme, alpha } from "@mui/material";
import { motion } from "framer-motion";

import EventIcon from "@mui/icons-material/Event";
import MailIcon from "@mui/icons-material/Mail";
import PeopleIcon from "@mui/icons-material/People";
import QrCodeIcon from "@mui/icons-material/QrCode";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import TimelineIcon from "@mui/icons-material/Timeline";

type TimelineItem = {
  id: string;
  timestamp: string;
  type: string;
  label: string;
};

type Props = {
  items: TimelineItem[];
};

function getIcon(type: string): React.ReactNode {
  switch (type) {
    case "event-created":
      return <EventIcon />;
    case "invitation-sent":
      return <MailIcon />;
    case "rsvp":
      return <PeopleIcon />;
    case "ticket-created":
      return <QrCodeIcon />;
    case "ticket-activated":
      return <CheckCircleIcon />;
    case "scan":
      return <LogoutIcon />;
    default:
      return <TimelineIcon />;
  }
}

export default function EventTimeline({ items }: Props) {
  const theme = useTheme();

  // sort by date descending
  const sorted = [...items].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <Stack spacing={3}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Timeline
      </Typography>

      <Box
        sx={{
          position: "relative",
          borderRadius: 5,
          bgcolor: alpha(theme.palette.background.paper, 0.3),
          backdropFilter: "blur(16px)",
          p: 2,
          boxShadow: theme.shadows[3],
        }}
      >
        {/* Vertical line */}
        <Box
          component={motion.div}
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 0.6 }}
          sx={{
            position: "absolute",
            left: 28,
            top: 20,
            width: "3px",
            bgcolor: theme.palette.primary.main,
            borderRadius: "3px",
          }}
        />

        <Stack spacing={3} sx={{ position: "relative", zIndex: 2 }}>
          {sorted.map((item) => (
            <Stack
              key={item.id}
              spacing={0.5}
              sx={{
                position: "relative",
                pl: 6,
              }}
            >
              {/* Node */}
              <Box
                component={motion.div}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 22,
                }}
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 4,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.palette.primary.main,
                  backdropFilter: "blur(10px)",
                  boxShadow: `
                    0 0 12px ${alpha(theme.palette.primary.main, 0.5)}
                  `,
                }}
              >
                {getIcon(item.type)}
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {item.label}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: 0.5 }}
              >
                {new Date(item.timestamp).toLocaleString("de-DE", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

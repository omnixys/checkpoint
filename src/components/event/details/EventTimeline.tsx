"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventIcon from "@mui/icons-material/Event";
import LogoutIcon from "@mui/icons-material/Logout";
import MailIcon from "@mui/icons-material/Mail";
import PeopleIcon from "@mui/icons-material/People";
import QrCodeIcon from "@mui/icons-material/QrCode";
import TimelineIcon from "@mui/icons-material/Timeline";
import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import type React from "react";

import type { EventTimelinePayload } from "@/checkpoint/generated/graphql";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

/**
 * Maps event type → icon
 */
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

interface Props {
  items: EventTimelinePayload[];
}

export default function EventTimeline({ items }: Props) {
  const theme = useTheme();
  const t = useTypedTranslations("event");

  const sorted = [...items].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    <Stack spacing={3}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {t("title")}
      </Typography>

      <Stack spacing={3}>
        {sorted.map((item, index) => (
          <Stack
            key={item.id}
            direction="row"
            spacing={2}
            sx={{
              alignItems: "flex-start",
            }}
          >
            {/* LEFT SIDE (NODE + LINE SEGMENT) */}
            <Stack sx={{ width: 40, alignItems: "center" }}>
              {/* NODE */}
              <Box
                component={motion.div}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.8,
                  )}, ${alpha(theme.palette.primary.main, 0.4)})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  boxShadow: `
                    0 0 16px ${alpha(theme.palette.primary.main, 0.6)},
                    0 0 32px ${alpha(theme.palette.primary.main, 0.3)}
                  `,
                }}
              >
                {getIcon(item.type)}
              </Box>

              {/* LINE SEGMENT (NOT GLOBAL ANYMORE) */}
              {index < sorted.length - 1 && (
                <Box
                  component={motion.div}
                  initial={{ height: 0 }}
                  animate={{ height: 40 }}
                  transition={{ duration: 0.4 }}
                  sx={{
                    width: "2px",
                    mt: 1,
                    background: `linear-gradient(
                      to bottom,
                      ${alpha(theme.palette.primary.main, 0.6)},
                      transparent
                    )`,
                  }}
                />
              )}
            </Stack>

            {/* RIGHT SIDE (CARD) */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              sx={{
                flex: 1,
                borderRadius: "20px",
                p: 2,
                backdropFilter: "blur(18px)",
                background: alpha(theme.palette.background.paper, 0.4),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                boxShadow: `
                  0 8px 32px ${alpha("#000", 0.4)},
                  inset 0 0 12px ${alpha(theme.palette.primary.main, 0.1)}
                `,
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `
                    0 12px 40px ${alpha("#000", 0.6)},
                    0 0 12px ${alpha(theme.palette.primary.main, 0.3)}
                  `,
                },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {/* {t(`timeline.${item.type}`)} */}
                {item.type}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: alpha(theme.palette.text.secondary, 0.8),
                  mt: 0.5,
                }}
              >
                {new Date(item.timestamp).toLocaleString("de-DE", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

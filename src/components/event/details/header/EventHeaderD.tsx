"use client";

import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { alpha, Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import React from "react";
import { EventHeaderProps } from "../EventActions";
import { getBestImage } from "@/checkpoint/components/event/details/header/EventHeaderB";

export default function EventHeaderD({ eventPageData: ev }: EventHeaderProps) {
  const theme = useTheme();
  const t = useTypedTranslations("event");
  const tCommon = useTypedTranslations("common");
  const locale = tCommon("locale");

  // 3D tilt values
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const rotateX = useTransform(tiltY, [-50, 50], [6, -6]);
  const rotateY = useTransform(tiltX, [-50, 50], [-6, 6]);

  const onMove = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    tiltX.set(e.clientX - (rect.left + rect.width / 2));
    tiltY.set(e.clientY - (rect.top + rect.height / 2));
  };

  const onLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const roleChipColor =
    ev.myRole === "ADMIN"
      ? "primary"
      : ev.myRole === "SECURITY"
        ? "success"
        : "default";

  const hero = getBestImage(ev.coverMedia, 1200) || "/event/event-default.png";

  return (
    <motion.div
      style={{ perspective: 1600 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        <Box
          sx={{
            position: "relative",
            borderRadius: "32px",
            overflow: "hidden",
            height: { xs: 260, sm: 300, md: 360 },
            boxShadow: `
              0 12px 40px ${alpha(theme.palette.common.black, 0.5)},
              0 0 90px ${alpha(theme.palette.primary.main, 0.1)}
            `,
            backdropFilter: "blur(22px)",
          }}
        >
          {/* Background Image */}
          <Image
            src={hero}
            alt={ev.name}
            fill
            style={{ objectFit: "cover", opacity: 0.75 }}
          />

          {/* Fog Gradient */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `
                linear-gradient(to bottom, transparent 40%, ${
                  theme.palette.background.default
                } 100%),
                radial-gradient(circle at top, ${alpha(
                  theme.palette.primary.main,
                  0.25,
                )} 0%, transparent 50%)
              `,
            }}
          />

          {/* Text */}
          <Stack
            spacing={1.5}
            sx={{
              position: "absolute",
              bottom: 24,
              left: 24,
              color: theme.palette.primary.contrastText,
              textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 900 }}>
              {ev.name}
            </Typography>

            <Chip
              label={
                ev.myRole
                  ? t(`header.role.${ev.myRole}`)
                  : t("header.role.GUEST")
              }
              color={roleChipColor}
              sx={{
                fontWeight: 700,
                backdropFilter: "blur(8px)",
                bgcolor: alpha(theme.palette.background.paper, 0.25),
                color: theme.palette.primary.contrastText,
                width: "fit-content",
              }}
            />

            <Typography variant="body1">
              {new Date(ev.settings.startsAt).toLocaleString(locale, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Typography>
            <Typography variant="body2">
              {t("header.until")}{" "}
              {new Date(ev.settings.endsAt).toLocaleString(locale, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Typography>
          </Stack>
        </Box>
      </motion.div>
    </motion.div>
  );
}

"use client";

import {
  alpha,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import { motion } from "framer-motion";
import Link from "next/link";

import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { env } from "@/checkpoint/lib/env";
import EventCardMedia from "./EventCardMedia";

interface Props {
  ev: any;
  toLocal: (dt: string | number | Date) => string;
  visualOverride: "auto" | "image" | "banner" | "none";
  isActive: boolean;
  onSetActive: () => void;
}

type EventStatus = "running" | "upcoming" | "past";

const STATUS_COLOR: Record<EventStatus, "success" | "warning" | "default"> = {
  running: "success",
  upcoming: "warning",
  past: "default",
};

export default function EventCardPro({
  ev,
  toLocal,
  visualOverride,
  isActive,
  onSetActive,
}: Props) {
  const t = useTypedTranslations("event");
  const theme = useTheme();

  const now = Date.now();
  const start = new Date(ev.settings.startsAt).getTime();
  const end = new Date(ev.settings.endsAt).getTime();

  const status: EventStatus =
    start <= now && end >= now ? "running" : start > now ? "upcoming" : "past";

  const style =
    visualOverride === "auto"
      ? //ev.settings?.visualStyle ??
        "none"
      : visualOverride;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.25 }}
    >
      <Card
        variant="outlined"
        sx={{
          borderRadius: 5,
          overflow: "hidden",
          bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : "background.paper",
          boxShadow: isActive
            ? `
                0 0 0 2px ${theme.palette.primary.main},
                0 0 18px ${alpha(theme.palette.primary.main, 0.3)}
              `
            : theme.shadows[1],
          transition: "all 0.25s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* MEDIA */}
        <EventCardMedia visualStyle={style} ev={ev} />

        <CardContent sx={{ flexGrow: 1 }}>
          <Stack spacing={1.5}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", flexWrap: "wrap", minWidth: 0 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, overflowWrap: "anywhere" }}>
                {ev.name}
              </Typography>

              {isActive && (
                <Chip
                  label={t("status.active")}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                />
              )}
            </Stack>

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <Chip
                size="small"
                label={t(`status.${status}` as const)}
                color={STATUS_COLOR[status]}
              />

              {typeof ev.settings.maxSeats === "number" && (
                <Chip size="small" label={t("details.maxSeats", { count: ev.settings.maxSeats })} />
              )}

              <Chip
                size="small"
                label={t(ev.settings.allowReEntry ? "details.reEntryOn" : "details.reEntryOff")}
                color={ev.settings.allowReEntry ? "success" : "default"}
                variant={ev.settings.allowReEntry ? "filled" : "outlined"}
              />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              {toLocal(ev.settings.startsAt)} – {toLocal(ev.settings.endsAt)}
            </Typography>
          </Stack>
        </CardContent>

        <Divider />

        <CardActions
          sx={{
            px: 2,
            py: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Button
            component={Link}
            href={`${env.CHECKPOINT_BASE_PATH}event/${ev.id}`}
            fullWidth={true}
            variant="contained"
            sx={{ borderRadius: 3, fontWeight: 600 }}
          >
            {t("actions.details")}
          </Button>

          {!isActive && (
            <Button
              fullWidth={true}
              variant="text"
              sx={{ borderRadius: 3, fontWeight: 700 }}
              onClick={onSetActive}
            >
              {t("actions.setActive")}
            </Button>
          )}
        </CardActions>
      </Card>
    </motion.div>
  );
}

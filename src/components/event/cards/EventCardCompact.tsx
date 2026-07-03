"use client";

import {
  alpha,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { env } from "@/checkpoint/lib/env";

interface Props {
  ev: any;
  toLocal: (dt: string | number | Date) => string;
  isActive: boolean;
  onSetActive: () => void;
}
type EventStatus = "running" | "upcoming" | "past";

const STATUS_COLOR: Record<EventStatus, "success" | "warning" | "default"> = {
  running: "success",
  upcoming: "warning",
  past: "default",
};

export default function EventCardCompact({ ev, toLocal, isActive, onSetActive }: Props) {
  const theme = useTheme();
  const t = useTypedTranslations("event");

  const now = Date.now();
  const start = new Date(ev.settings.startsAt).getTime();
  const end = new Date(ev.settings.endsAt).getTime();

  const status: EventStatus =
    start <= now && end >= now ? "running" : start > now ? "upcoming" : "past";

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
          bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : "background.paper",
          boxShadow: isActive
            ? `
                0 0 0 2px ${theme.palette.primary.main},
                0 0 16px ${alpha(theme.palette.primary.main, 0.25)}
              `
            : theme.shadows[1],
          transition: "all 0.25s ease",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ pb: 1.5 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ alignItems: { xs: "flex-start", sm: "center" }, minWidth: 0 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, overflowWrap: "anywhere" }}>
              {ev.name}
            </Typography>

            {isActive && (
              <Chip
                label={t("status.active")}
                color="primary"
                size="small"
                sx={{ fontWeight: 700 }}
              />
            )}

            <Box sx={{ flex: 1, display: { xs: "none", sm: "block" } }} />

            <Chip label={t(`status.${status}`)} size="small" color={STATUS_COLOR[status]} />
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {toLocal(ev.settings.startsAt)} – {toLocal(ev.settings.endsAt)}
          </Typography>
        </CardContent>

        <CardActions
          sx={{
            px: 2,
            pb: 2,
            gap: 1,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
          }}
        >
          <Button
            component={Link}
            href={`${env.CHECKPOINT_BASE_PATH}event/${ev.id}`}
            variant="contained"
            sx={{ borderRadius: 3, fontWeight: 600, width: { xs: "100%", sm: "auto" } }}
          >
            {t("actions.details")}
          </Button>

          {!isActive && (
            <Button
              sx={{ fontWeight: 700, borderRadius: 3, width: { xs: "100%", sm: "auto" } }}
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

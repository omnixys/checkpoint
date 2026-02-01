"use client";

import type { Event } from "@/types/event/event.type";
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

type Props = {
  ev: Event;
  toLocal: (dt: string | number | Date) => string;
  isActive: boolean;
  onSetActive: () => void;
};

export default function EventCardCompact({
  ev,
  toLocal,
  isActive,
  onSetActive,
}: Props) {
  const theme = useTheme();

  const now = Date.now();
  const start = new Date(ev.startsAt).getTime();
  const end = new Date(ev.endsAt).getTime();

  const status =
    start <= now && end >= now
      ? ("Läuft" as const)
      : start > now
        ? ("Kommend" as const)
        : ("Vergangen" as const);

  const statusColor =
    status === "Läuft"
      ? "success"
      : status === "Kommend"
        ? "warning"
        : "default";

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
          bgcolor: isActive
            ? alpha(theme.palette.primary.main, 0.08)
            : "background.paper",
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
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {ev.name}
            </Typography>

            {isActive && (
              <Chip
                label="Aktiv"
                color="primary"
                size="small"
                sx={{ fontWeight: 700 }}
              />
            )}

            <Box sx={{ flex: 1 }} />

            <Chip label={status} size="small" color={statusColor} />
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {toLocal(ev.startsAt)} – {toLocal(ev.endsAt)}
          </Typography>
        </CardContent>

        <CardActions
          sx={{
            px: 2,
            pb: 2,
            gap: 1,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            component={Link}
            href={`/checkpoint/event/${ev.id}`}
            variant="contained"
            sx={{ borderRadius: 3, fontWeight: 600 }}
          >
            Details
          </Button>

          {!isActive && (
            <Button
              sx={{ fontWeight: 700, borderRadius: 3 }}
              onClick={onSetActive}
            >
              Als aktiv setzen
            </Button>
          )}
        </CardActions>
      </Card>
    </motion.div>
  );
}

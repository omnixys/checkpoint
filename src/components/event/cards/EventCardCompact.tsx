"use client";

import { EventPayload } from "@/checkpoint/generated/graphql";
import { env } from "@/checkpoint/lib/env";
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
  ev: EventPayload;
  toLocal: (dt: string | number | Date) => string;
  isActive: boolean;
  onSetActive: () => void;
};

export default function EventCardCompact({ ev, toLocal, isActive, onSetActive }: Props) {
  const theme = useTheme();

  const now = Date.now();
  const start = new Date(ev.settings.startsAt).getTime();
  const end = new Date(ev.settings.endsAt).getTime();

  const status =
    start <= now && end >= now
      ? ("Läuft" as const)
      : start > now
        ? ("Kommend" as const)
        : ("Vergangen" as const);

  const statusColor = status === "Läuft" ? "success" : status === "Kommend" ? "warning" : "default";

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
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {ev.name}
            </Typography>

            {isActive && (
              <Chip label="Aktiv" color="primary" size="small" sx={{ fontWeight: 700 }} />
            )}

            <Box sx={{ flex: 1 }} />

            <Chip label={status} size="small" color={statusColor} />
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
            justifyContent: "space-between",
          }}
        >
          <Button
            component={Link}
            href={`${env.CHECKPOINT_BASE_PATH}event/${ev.id}`}
            variant="contained"
            sx={{ borderRadius: 3, fontWeight: 600 }}
          >
            Details
          </Button>

          {!isActive && (
            <Button sx={{ fontWeight: 700, borderRadius: 3 }} onClick={onSetActive}>
              Als aktiv setzen
            </Button>
          )}
        </CardActions>
      </Card>
    </motion.div>
  );
}

"use client";

import {
  Box,
  Stack,
  Typography,
  Chip,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import { motion } from "framer-motion";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

type Props = {
  code: string;
  status: "ACTIVE" | "PENDING" | "REVOKED";
  seatLabel?: string;
  presence?: "INSIDE" | "OUTSIDE" | null;
  onDelete: () => void;
  onOpen: () => void;
};

export default function TicketCard({
  code,
  status,
  seatLabel,
  presence,
  onDelete,
  onOpen,
}: Props) {
  const theme = useTheme();

const rawStatus = status || "UNKNOWN";

// Mapping aller möglichen Werte
const statusCfgMap: Record<string, { label: string; color: string }> = {
  ACTIVE: {
    label: "Aktiv",
    color: theme.palette.success.main,
  },
  PENDING: {
    label: "Nicht aktiviert",
    color: theme.palette.warning.main,
  },
  REVOKED: {
    label: "Gesperrt",
    color: theme.palette.error.main,
  },

  // Falls dein Backend currentState liefert:
  INSIDE: {
    label: "Im Event",
    color: theme.palette.info.main,
  },
  OUTSIDE: {
    label: "Draußen",
    color: theme.palette.secondary.main,
  },

  // Fallback
  UNKNOWN: {
    label: "Unbekannt",
    color: theme.palette.grey[500],
  },
};

const statusCfg = statusCfgMap[rawStatus] ?? statusCfgMap["UNKNOWN"];

  return (
    <Box
      component={motion.div}
      whileHover={{ y: -3, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
      onClick={onOpen}
      sx={{
        p: 2.4,
        borderRadius: 4,
        cursor: "pointer",
        bgcolor: alpha(theme.palette.background.paper, 0.55),
        backdropFilter: "blur(22px)",
        border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
        boxShadow: theme.shadows[1],
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between">
          <QrCode2RoundedIcon sx={{ fontSize: 44 }} />

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            sx={{ color: theme.palette.error.main }}
          >
            <DeleteRoundedIcon />
          </IconButton>
        </Stack>

        <Typography variant="subtitle1" fontWeight={600}>
          {code}
        </Typography>

        <Chip
          label={statusCfg.label}
          sx={{
            bgcolor: alpha(statusCfg.color, 0.15),
            color: statusCfg.color,
            fontWeight: 600,
            width: "fit-content",
          }}
        />

        {seatLabel && (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            Platz: {seatLabel}
          </Typography>
        )}

        {presence && (
          <Typography
            variant="body2"
            sx={{
              color:
                presence === "INSIDE"
                  ? theme.palette.info.main
                  : theme.palette.secondary.main,
            }}
          >
            Status: {presence === "INSIDE" ? "Im Event" : "Draußen"}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

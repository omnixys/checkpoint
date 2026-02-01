"use client";

import { Seat } from "@/types/seat/seat.type";
import {
  alpha,
  Button,
  Divider,
  Drawer,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { EventRole } from "../../../types/event/event-enum.type";

export default function SeatDetailDrawer({
  open,
  seat,
  onClose,
  onEdit,
  getSeatHolderLabel,
  role
}: {
  open: boolean;
  seat: Seat | undefined;
  onClose: () => void;
  onEdit: () => void;
    getSeatHolderLabel: (seat: Seat) => string;
    role?: EventRole;
}) {
  const theme = useTheme();
  const [seatId, setSeatId] = useState<string | null>(null);
  const fullName = (seat: Seat) => getSeatHolderLabel(seat);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 420 },
          p: 3,
          backdropFilter: "blur(20px)",
          background: alpha(theme.palette.background.paper, 0.5),
        },
      }}
    >
      {seat && (
        <Stack
          component={motion.div}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          spacing={2}
        >
          <Typography variant="h5" fontWeight={700}>
            Seat {seat.number}
          </Typography>

          <Divider />

          <Typography>Bereich: {seat.section?.name ?? "–"}</Typography>
          <Typography>Tisch: {seat.table?.name ?? "–"}</Typography>
          <Typography>Status: {seat.guestId ? "Besetzt" : "Frei"}</Typography>
          {seat.guestId && <Typography>Gast: {fullName(seat)}</Typography>}

          {seat.invitationId && (
            <Typography>Einladung: {fullName(seat)}</Typography>
          )}

          <Typography>Notiz: {seat.note ?? "Keine"}</Typography>

          <Divider />

          {role && role === "ADMIN" && (
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={onEdit}>
                Bearbeiten
              </Button>
              <Button variant="outlined" onClick={onClose}>
                Schließen
              </Button>
            </Stack>
          )}
        </Stack>
      )}
    </Drawer>
  );
}

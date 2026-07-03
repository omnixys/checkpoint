"use client";

import { alpha, Button, Divider, Drawer, Stack, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import type { UserRoleType } from "@/checkpoint/generated/graphql";
import type { SeatListType } from "@/checkpoint/types/seat.type";

export default function SeatDetailDrawer({
  open,
  seat,
  onClose,
  onEdit,
  getSeatHolderLabel,
  role,
}: {
  open: boolean;
  seat: SeatListType | undefined;
  onClose: () => void;
  onEdit: () => void;
  getSeatHolderLabel: (SeatPayload: SeatListType) => string;
  role: UserRoleType | undefined;
}) {
  const theme = useTheme();
  const [_seatId, _setSeatId] = useState<string | null>(null);
  const fullName = (SeatPayload: SeatListType) => getSeatHolderLabel(SeatPayload);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 420 },
            maxWidth: "100vw",
            p: { xs: 2, sm: 3 },
            backdropFilter: "blur(20px)",
            background: alpha(theme.palette.background.paper, 0.5),
          },
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
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
            }}
          >
            seat {seat.number}
          </Typography>

          <Divider />

          <Typography>Bereich: {seat.section?.name ?? "–"}</Typography>
          <Typography>Tisch: {seat.table?.name ?? "–"}</Typography>
          <Typography>Status: {seat.guestId ? "Besetzt" : "Frei"}</Typography>
          {seat.guestId && <Typography>Gast: {fullName(seat)}</Typography>}

          {seat.invitationId && <Typography>Einladung: {fullName(seat)}</Typography>}

          <Typography>Notiz: {seat.note ?? "Keine"}</Typography>

          <Divider />

          {role && role === "ADMIN" && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
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

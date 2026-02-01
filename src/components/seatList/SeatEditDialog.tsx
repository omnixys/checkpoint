"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";

import { Invitation } from "@/types/invitation/invitation.type";
import { Seat } from "@/types/seat/seat.type";
import { User } from "@/types/user/user.type";

export default function SeatEditDialog({
  open,
  seat,
  onClose,
  onSave,
  invitationList,
  guestList,
}: {
  open: boolean;
  seat?: Seat;
  invitationList: Invitation[];
  guestList: User[];
  onClose: () => void;
  onSave: (input: {
    seatId: string;
    invitationId?: string;
    guestId?: string;
    note?: string;
  }) => void;
}) {
  const [invitationId, setInvitationId] = React.useState<string>("");
  const [guestId, setGuestId] = React.useState<string>("");
  const [note, setNote] = React.useState<string>("");

  const safeInvitationId =
    invitationId && invitationList.some((i) => i.id === invitationId)
      ? invitationId
      : "";

  React.useEffect(() => {
    setInvitationId(seat?.invitationId ?? "");
    setGuestId(seat?.guestId ?? "");
    setNote(seat?.note ?? "");
  }, [seat]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Gast zuweisen</DialogTitle>

      <DialogContent>
        {!seat ? (
          <Stack sx={{ py: 4 }} alignItems="center">
            Lade Sitzdaten…
          </Stack>
        ) : (
          <Stack spacing={2} sx={{ mt: 1 }}>
            {/* FIXED INFO */}
            <TextField
              label="Sitzplatz"
              value={`Section ${seat.section.name} • Tisch ${
                seat.table.name
              } • Sitz ${seat.number ?? "—"}`}
              disabled
            />

            {/* INVITATION SELECT */}
            <TextField
              select
              label="Einladung"
              value={safeInvitationId}
              onChange={(e) => {
                setInvitationId(e.target.value);
                setGuestId("");
              }}
            >
              <MenuItem value="">— Keine Einladung —</MenuItem>
              {invitationList.map((inv) => (
                <MenuItem key={inv.id} value={inv.id}>
                  {inv.firstName} {inv.lastName}
                </MenuItem>
              ))}
            </TextField>

            {/* GUEST SELECT */}
            <TextField
              select
              label="Eigener Gast (User)"
              value={guestId}
              // disabled={disableGuest}
              onChange={(e) => {
                setGuestId(e.target.value);
                setInvitationId("");
              }}
            >
              <MenuItem value="">— Kein Gast —</MenuItem>
              {guestList.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.firstName} {g.lastName}
                </MenuItem>
              ))}
            </TextField>

            {/* OPTIONAL NOTE */}
            <TextField
              label="Notiz (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              multiline
              minRows={2}
            />

            <Button
              variant="contained"
              onClick={() =>
                onSave({
                  seatId: seat.id,
                  invitationId: invitationId.trim() || undefined,
                  guestId: guestId.trim() || undefined,
                  note: note.trim() || undefined,
                })
              }
            >
              Speichern
            </Button>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}

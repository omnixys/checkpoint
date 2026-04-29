"use client";

import {
  AssignSeatInput,
  InvitationPayload,
  SeatPayload,
  UserPayload,
} from "@/checkpoint/generated/graphql";
import { GuestType } from "@/checkpoint/types/event.type";
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

export default function SeatEditDialog({
  open,
  seat,
  onClose,
  onSave,
  invitationList,
  guestList,
}: {
  open: boolean;
  seat?: SeatPayload;
  invitationList: InvitationPayload[];
  guestList: GuestType[];
  onClose: () => void;
  onSave: (input: AssignSeatInput) => void;
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
          <Stack
            sx={{
              alignItems: "center",
              py: 4,
            }}
          >
            Lade Sitzdaten…
          </Stack>
        ) : (
          <Stack spacing={2} sx={{ mt: 1 }}>
            {/* FIXED INFO */}
            <TextField
              label="Sitzplatz"
              value={`Section ${seat.section.name} • Tisch ${
                seat.table?.name
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
                  {g.personalInfo?.firstName} {g.personalInfo?.lastName}
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
                  invitationId: invitationId.trim() || null,
                  guestId: guestId.trim() || null,
                  note: note.trim() || null,
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

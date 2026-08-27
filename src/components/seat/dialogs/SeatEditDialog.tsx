"use client";

import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import type {
  AssignSeatInput,
  InvitationPayload,
  SeatPayload,
} from "@/checkpoint/generated/graphql";
import { InvitationStatus } from "@/checkpoint/generated/graphql";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import type { GuestType } from "@/checkpoint/types/event.type";
import {
  buildSeatAssignmentInput,
  type SeatAssignmentChoice,
} from "@/checkpoint/utils/seat/assignment-input";

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
  onSave: (input: AssignSeatInput) => Promise<void>;
}) {
  const t = useTypedTranslations("invitation");
  const ticketGuestsLabel = t("seatAssignment.ticketGuests");
  const stagedInvitationsLabel = t("seatAssignment.stagedInvitations");
  const openInvitationsLabel = t("seatAssignment.openInvitations");
  type AssignmentOption = {
    id: string;
    kind: "guest" | "staged" | "invitation";
    label: string;
    group: string;
  };

  const [assignment, setAssignment] = React.useState<AssignmentOption | null>(null);
  const [note, setNote] = React.useState<string>("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const options = React.useMemo<AssignmentOption[]>(() => {
    const guests = guestList.map((guest) => ({
      id: guest.id,
      kind: "guest" as const,
      label:
        `${guest.personalInfo?.firstName ?? ""} ${guest.personalInfo?.lastName ?? ""}`.trim() ||
        guest.username,
      group: ticketGuestsLabel,
    }));
    const invitations = invitationList
      .filter(
        (invitation) =>
          invitation.status === InvitationStatus.APPROVAL_STAGED ||
          invitation.status === InvitationStatus.ACCEPTED ||
          invitation.status === InvitationStatus.PENDING,
      )
      .map((invitation) => {
        const staged = invitation.status === InvitationStatus.APPROVAL_STAGED;
        return {
          id: invitation.id,
          kind: staged ? ("staged" as const) : ("invitation" as const),
          label:
            `${invitation.firstName ?? ""} ${invitation.lastName ?? ""}`.trim() ||
            invitation.email ||
            invitation.id,
          group: staged ? stagedInvitationsLabel : openInvitationsLabel,
        };
      });
    return [...guests, ...invitations];
  }, [guestList, invitationList, openInvitationsLabel, stagedInvitationsLabel, ticketGuestsLabel]);

  React.useEffect(() => {
    const assignedId = seat?.guestId ?? seat?.invitationId;
    setAssignment(options.find((option) => option.id === assignedId) ?? null);
    setNote(seat?.note ?? "");
    setError(null);
  }, [options, seat]);

  const save = async (clearAssignment = false) => {
    if (!seat || saving) return;
    setSaving(true);
    setError(null);
    try {
      const next = clearAssignment ? null : assignment;
      await onSave(buildSeatAssignmentInput(seat.id, next as SeatAssignmentChoice, note));
    } catch {
      setError(t("seatAssignment.conflictError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="sm">
      <DialogTitle>{t("seatAssignment.title")}</DialogTitle>

      <DialogContent>
        {seat ? (
          <Stack spacing={2} sx={{ mt: 1 }}>
            {/* FIXED INFO */}
            <TextField
              label={t("seatAssignment.seat")}
              value={t("seatAssignment.seatValue", {
                section: seat.section.name,
                table: seat.table?.name ?? t("seatAssignment.noTable"),
                seat: seat.number ?? "—",
              })}
              disabled={true}
            />

            <Autocomplete
              options={options}
              value={assignment}
              onChange={(_, value) => setAssignment(value)}
              groupBy={(option) => option.group}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) =>
                option.id === value.id && option.kind === value.kind
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("seatAssignment.holder")}
                  placeholder={t("seatAssignment.search")}
                />
              )}
            />

            {/* OPTIONAL NOTE */}
            <TextField
              label={t("seatAssignment.note")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              multiline={true}
              minRows={2}
            />

            {error && <Typography color="error">{error}</Typography>}
          </Stack>
        ) : (
          <Stack
            sx={{
              alignItems: "center",
              py: 4,
            }}
          >
            {t("seatAssignment.loading")}
          </Stack>
        )}
      </DialogContent>
      {seat && (
        <DialogActions>
          {(seat.guestId || seat.invitationId) && (
            <Button color="warning" onClick={() => void save(true)} disabled={saving}>
              {t("seatAssignment.remove")}
            </Button>
          )}
          <Button onClick={onClose} disabled={saving}>
            {t("seatAssignment.cancel")}
          </Button>
          <Button variant="contained" onClick={() => void save()} disabled={saving}>
            {saving ? t("seatAssignment.saving") : t("seatAssignment.save")}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

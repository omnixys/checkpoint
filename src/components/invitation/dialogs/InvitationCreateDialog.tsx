"use client";

import DialogTransition from "@/checkpoint/components/DialogTransition";
import PhoneNumberField from "@/checkpoint/components/common/phoneNumber/PhoneNumberField";
import { useInvitationForm } from "@/checkpoint/hooks/invitation/useInvitationForm";
import { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { CallingCodeCountry } from "@/checkpoint/types/country.type";
import { EventListItem } from "@/checkpoint/types/event.type";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "next/navigation";

type Props = {
  logic: InvitationLogic;
  callingCodeCountries: CallingCodeCountry[];
};

export default function InvitationCreateDialog({ logic, callingCodeCountries }: Props) {
  const params = useParams();
  const eventId = String(params.id);

  const {
    values,
    setField,
    phoneNumbers,
    addPhone,
    removePhone,
    updatePhone,
    isValid,
    resetForm,
    buildCreateInput,
  } = useInvitationForm({
    eventId,
    defaultCountry: "+49",
    autoCreateFirstPhone: true,
  });

  const handleClose = () => {
    logic.setCreateOpen(false);
    resetForm();
  };

  const handleCreate = async () => {
    await logic.createInvitation({
      variables: {
        input: buildCreateInput(),
      },
    });

    handleClose();
    await logic.refetch();
  };

  return (
    <Dialog
      open={logic.createOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        transition: DialogTransition,
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Neue Einladung erstellen</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Stack spacing={2}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
              }}
            >
              Person
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Vorname"
                fullWidth
                value={values.firstName}
                onChange={(e) => setField("firstName", e.target.value)}
              />

              <TextField
                label="Nachname"
                fullWidth
                value={values.lastName}
                onChange={(e) => setField("lastName", e.target.value)}
              />
            </Stack>

            <TextField
              label="E-Mail"
              fullWidth
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
            />
          </Stack>

          <Divider />

          <Stack spacing={2}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
              }}
            >
              Telefonnummern
            </Typography>

            <Stack
              spacing={2}
              sx={{
                mt: 2,
              }}
            >
              {phoneNumbers.map((phoneNumber, index) => (
                <PhoneNumberField
                  key={`${index}`}
                  value={phoneNumber}
                  index={index}
                  countries={callingCodeCountries}
                  onChange={updatePhone}
                  onRemove={removePhone}
                />
              ))}
            </Stack>

            <Button
              variant="outlined"
              startIcon={<AddRoundedIcon />}
              onClick={addPhone}
              sx={{
                alignSelf: "flex-start",
                borderStyle: "dashed",
              }}
            >
              Telefonnummer hinzufügen
            </Button>
          </Stack>

          <Divider />

          <Stack spacing={2}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
              }}
            >
              Einladung
            </Typography>

            <TextField
              type="number"
              label="Max. Begleitpersonen"
              fullWidth
              value={values.maxInvitees}
              onChange={(e) => setField("maxInvitees", Math.max(0, Number(e.target.value) || 0))}
              slotProps={{
                input: {
                  minRows: 0,
                },
              }}
            />

            <TextField
              select
              fullWidth
              label="Eingeladen von (optional)"
              value={values.eventId}
              onChange={(e) => setField("eventId", e.target.value)}
              helperText="Optional: Wer hat diese Person eingeladen?"
            >
              {/* NONE OPTION */}
              <MenuItem value="">
                <em>Keine Zuordnung</em>
              </MenuItem>

              {logic.events?.map((event: EventListItem) => {
                const name = `${event.name ?? ""}`.trim() || "Unbekannt";

                const eventName = event.id;

                return (
                  <MenuItem key={event.id} value={event.id}>
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <span>{name}</span>
                      <Typography variant="caption" color="text.secondary">
                        {eventName}
                      </Typography>
                    </Stack>
                  </MenuItem>
                );
              })}
            </TextField>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Abbrechen</Button>
        <Button variant="contained" onClick={handleCreate} disabled={!isValid}>
          Einladung erstellen
        </Button>
      </DialogActions>
    </Dialog>
  );
}

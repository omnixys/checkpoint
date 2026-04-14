"use client";

import { useMemo, useState } from "react";
import { Alert, Box, Button, Stack, TextField, Typography, useTheme } from "@mui/material";

import PhoneNumberDialog from "@/checkpoint/components/common/phoneNumber/PhoneNumberDialog";
import PhoneNumberListAccordion from "@/checkpoint/components/common/phoneNumber/PhoneNumberListAccordion";
import PlusOneDialog from "@/checkpoint/components/common/plus-one/PlusOneDialog";
import PlusOneListAccordion from "@/checkpoint/components/common/plus-one/PlusOneListAccordion";
import { useRsvpForm } from "@/checkpoint/hooks/invitation/useRsvpForm";

type AcceptFormProps = {
  invitation: any;
  countries: any[];
  onAccepted: () => void;
};

export default function AcceptForm({ invitation, countries, onAccepted }: AcceptFormProps) {
  const theme = useTheme();
  const form = useRsvpForm(invitation);

  const [phoneDialogIndex, setPhoneDialogIndex] = useState<number | null>(null);
  const [plusOneDialogIndex, setPlusOneDialogIndex] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedPhone = useMemo(() => {
    if (phoneDialogIndex === null) {
      return null;
    }

    return form.state.phoneNumbers[phoneDialogIndex] ?? null;
  }, [phoneDialogIndex, form.state.phoneNumbers]);

  const selectedPlusOne = useMemo(() => {
    if (plusOneDialogIndex === null) {
      return null;
    }

    return form.state.plusOnes[plusOneDialogIndex] ?? null;
  }, [plusOneDialogIndex, form.state.plusOnes]);

  const handleSubmit = async () => {
    try {
      setSubmitError(null);
      await form.submit();
      onAccepted();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Teilnahme konnte nicht bestätigt werden.",
      );
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 4,
        background: theme.palette.background.paper,
      }}
    >
      <Stack spacing={3}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
          }}
        >
          Teilnahme bestätigen
        </Typography>

        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            label="Vorname"
            value={form.state.firstName}
            onChange={(e) => form.update("firstName", e.target.value)}
          />

          <TextField
            fullWidth
            label="Nachname"
            value={form.state.lastName}
            onChange={(e) => form.update("lastName", e.target.value)}
          />
        </Stack>

        <TextField
          fullWidth
          label="E-Mail"
          value={form.state.email}
          onChange={(e) => form.update("email", e.target.value)}
        />

        <PhoneNumberListAccordion
          values={form.state.phoneNumbers}
          onAdd={form.addPhone}
          onEdit={setPhoneDialogIndex}
          onRemove={form.removePhone}
        />

        <PlusOneListAccordion
          values={form.state.plusOnes}
          onAdd={form.addPlusOne}
          onEdit={setPlusOneDialogIndex}
          onRemove={form.removePlusOne}
        />

        {submitError && <Alert severity="error">{submitError}</Alert>}

        <Button variant="contained" disabled={!form.isValid} onClick={handleSubmit}>
          Teilnahme bestätigen
        </Button>
      </Stack>

      <PhoneNumberDialog
        open={phoneDialogIndex !== null}
        index={phoneDialogIndex}
        value={selectedPhone}
        countries={countries ?? []}
        onClose={() => setPhoneDialogIndex(null)}
        onChange={form.updatePhone}
      />

      <PlusOneDialog
        open={plusOneDialogIndex !== null}
        index={plusOneDialogIndex}
        value={selectedPlusOne}
        countries={countries ?? []}
        onClose={() => setPlusOneDialogIndex(null)}
        onChange={form.updatePlusOne}
        onAddPhone={form.addPlusOnePhone}
        onUpdatePhone={form.updatePlusOnePhone}
        onRemovePhone={form.removePlusOnePhone}
        onRemove={form.removePlusOne}
      />
    </Box>
  );
}

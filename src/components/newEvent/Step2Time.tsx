"use client";

import React, { useState } from "react";
import { Stack, Typography, Button, Grid, Alert } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AppleCardGlass } from "./EventSteps.style";

export default function Step2Time({ form, update, onNext, onBack }) {
  const [error, setError] = useState<string | null>(null);

  function handleNext() {
    if (!form.startsAt || !form.endsAt) {
      setError("Bitte Start- und Endzeit angeben.");
      return;
    }

    const start = dayjs(form.startsAt);
    const end = dayjs(form.endsAt);

    if (end.isBefore(start)) {
      setError("Endzeit darf nicht vor der Startzeit liegen.");
      return;
    }

    setError(null);
    onNext();
  }

  return (
    <AppleCardGlass>
      <Stack spacing={3}>
        <Typography variant="h6" textAlign="center" fontWeight={700}>
          Schritt 2 – Zeitraum
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <DateTimePicker
              label="Start"
              value={form.startsAt ? dayjs(form.startsAt) : null}
              onChange={(v) => update("startsAt", v?.toISOString())}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DateTimePicker
              label="Ende"
              value={form.endsAt ? dayjs(form.endsAt) : null}
              minDateTime={form.startsAt ? dayjs(form.startsAt) : undefined}
              onChange={(v) => update("endsAt", v?.toISOString())}
            />
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="space-between">
          <Button onClick={onBack}>Zurück</Button>
          <Button
            variant="contained"
            sx={{ borderRadius: 3 }}
            onClick={handleNext}
          >
            Weiter
          </Button>
        </Stack>
      </Stack>
    </AppleCardGlass>
  );
}

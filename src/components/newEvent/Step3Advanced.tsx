"use client";

import { useState } from "react";
import { Stack, Typography, TextField, Button, Alert } from "@mui/material";
import { AppleCardGlass } from "./EventSteps.style";

export default function Step3Advanced({
  form,
  update,
  onBack,
  onNext,
  loading,
}) {
  const [error, setError] = useState<string | null>(null);

  function handleFinish() {
    if (form.rotateSeconds < 30) {
      setError("QR-Rotation muss mindestens 30 Sekunden betragen.");
      return;
    }

    setError(null);
     onNext();
  }

  return (
    <AppleCardGlass>
      <Stack spacing={2}>
        <Typography variant="h6" textAlign="center" fontWeight={700}>
          Schritt 3 – Erweiterte Einstellungen (Optional)
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Dresscode"
          value={form.dressCode}
          onChange={(e) => update("dressCode", e.target.value)}
        />

        <TextField
          type="number"
          label="Standard Sektion"
          value={form.defaultSection}
          onChange={(e) => update("defaultSection", Number(e.target.value))}
        />

        <TextField
          type="number"
          label="Standard Tisch"
          value={form.defaultTable}
          onChange={(e) => update("defaultTable", Number(e.target.value))}
        />

        <TextField
          type="number"
          label="QR-Rotation (Sekunden)"
          value={form.rotateSeconds}
          onChange={(e) => update("rotateSeconds", Number(e.target.value))}
        />

        <Stack direction="row" justifyContent="space-between">
          <Button onClick={onBack}>Zurück</Button>

          <Button
            variant="contained"
            sx={{ borderRadius: 3 }}
            disabled={loading}
            onClick={handleFinish}
          >
            Event erstellen
          </Button>
        </Stack>
      </Stack>
    </AppleCardGlass>
  );
}

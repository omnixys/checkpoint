"use client";

import React, { useState } from "react";
import {
  Stack,
  TextField,
  Typography,
  Button,
  Switch,
  Alert,
  FormControlLabel,
} from "@mui/material";
import { AppleCardGlass } from "./EventSteps.style";

export default function Step1Basics({ form, update, onNext }) {
  const [error, setError] = useState<string | null>(null);

  function handleNext() {
    if (!form.name.trim()) {
      setError("Eventname darf nicht leer sein.");
      return;
    }
    setError(null);
    onNext();
  }

  return (
    <AppleCardGlass>
      <Stack spacing={2}>
        <Typography variant="h6" textAlign="center" fontWeight={700}>
          Schritt 1 – Basisdaten
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Eventname"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          fullWidth
        />

        <TextField
          type="number"
          label="Max. Sitzplätze"
          value={form.maxSeats}
          onChange={(e) => update("maxSeats", Number(e.target.value))}
        />

        <FormControlLabel
          control={
            <Switch
              checked={form.allowReEntry}
              onChange={(e) => update("allowReEntry", e.target.checked)}
            />
          }
          label="Wiedereinlass erlauben"
        />

        <TextField
          label="Location"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
        />

        <TextField
          label="Beschreibung"
          multiline
          minRows={2}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />

        <Button
          variant="contained"
          sx={{ borderRadius: 3 }}
          onClick={handleNext}
        >
          Weiter
        </Button>
      </Stack>
    </AppleCardGlass>
  );
}

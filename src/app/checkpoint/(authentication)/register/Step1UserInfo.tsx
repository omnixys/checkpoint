"use client";

import { SignUpStep1 } from "@/types/authentication/auth.type";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { JSX, useState } from "react";
import { validateStep1 } from "./signup.logic";
import { AppleCardGlass } from "./signup.style";

interface Props {
  value: SignUpStep1;
  onChange: (v: SignUpStep1) => void;
  onNext: () => void;
}

export function Step1UserInfo({ value, onChange, onNext }: Props): JSX.Element {
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof SignUpStep1, val: string): void => {
    onChange({ ...value, [field]: val });
  };

  const handleNext = (): void => {
    const err = validateStep1(value);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <AppleCardGlass>
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={600} textAlign="center">
          Schritt 1 – Persönliche Daten
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Vorname"
          value={value.firstName}
          onChange={(e) => update("firstName", e.target.value)}
          fullWidth
        />

        <TextField
          label="Nachname"
          value={value.lastName}
          onChange={(e) => update("lastName", e.target.value)}
          fullWidth
        />

        <TextField
          label="Username"
          value={value.username}
          onChange={(e) => update("username", e.target.value)}
          fullWidth
        />

        <TextField
          label="E-Mail"
          type="email"
          value={value.email}
          onChange={(e) => update("email", e.target.value)}
          fullWidth
        />

        <Button
          variant="contained"
          onClick={handleNext}
          sx={{ borderRadius: 3 }}
        >
          Weiter
        </Button>
      </Stack>
    </AppleCardGlass>
  );
}

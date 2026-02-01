"use client";

import {
  Alert,
  Button,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { JSX, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { AppleCardGlass } from "./signup.style";

import { SignUpStep2Item } from "@/types/authentication/auth.type";
import { PhoneNumberType } from "@/types/user/user-enum-type";
import { validatePhones } from "./signup.logic";

interface Props {
  phones: SignUpStep2Item[];
  onChange: (v: SignUpStep2Item[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2Phones({
  phones,
  onChange,
  onNext,
  onBack,
}: Props): JSX.Element {
  const [error, setError] = useState<string | null>(null);

  const addPhone = (): void => {
    const isFirst = phones.length === 0;

    const newPhone: SignUpStep2Item = {
      type: PhoneNumberType.MOBILE,
      number: "",
      isPrimary: isFirst,
    };

    onChange([...phones, newPhone]);
  };

  const updatePhone = (
    index: number,
    field: keyof SignUpStep2Item,
    value: string | boolean
  ): void => {
    const updated = [...phones];
    (updated[index] as any)[field] = value;

    if (field === "isPrimary" && value === true) {
      updated.forEach((p, i) => {
        if (i !== index) p.isPrimary = false;
      });
    }

    onChange(updated);
  };

  const removePhone = (index: number): void => {
    const updated = [...phones];
    const removedPhone = updated.splice(index, 1);

    if (removedPhone[0].isPrimary && updated.length > 0) {
      updated[0].isPrimary = true;
    }

    onChange(updated);
  };

  const handleNext = (): void => {
    const err = validatePhones(phones);
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
        <Typography variant="h6" textAlign="center" fontWeight={600}>
          Schritt 2 – Telefonnummern
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Button
          startIcon={<AddIcon />}
          onClick={addPhone}
          sx={{ borderRadius: 3 }}
        >
          Nummer hinzufügen
        </Button>

        {phones.map((p, index) => (
          <Stack
            key={index}
            spacing={1}
            sx={{
              p: 2,
              borderRadius: 3,
              background: "rgba(255,255,255,0.35)",
              backdropFilter: "blur(15px)",
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle2" fontWeight={600}>
                Nummer {index + 1}
              </Typography>

              <IconButton onClick={() => removePhone(index)}>
                <DeleteIcon />
              </IconButton>
            </Stack>

            <TextField
              label="Typ"
              select
              value={p.type}
              onChange={(e) =>
                updatePhone(index, "type", e.target.value as PhoneNumberType)
              }
            >
              {Object.values(PhoneNumberType).map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Telefonnummer"
              value={p.number}
              onChange={(e) => updatePhone(index, "number", e.target.value)}
              fullWidth
            />

            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Primär</Typography>
              <Switch
                checked={p.isPrimary}
                onChange={(e) =>
                  updatePhone(index, "isPrimary", e.target.checked)
                }
              />
            </Stack>
          </Stack>
        ))}

        <Stack direction="row" justifyContent="space-between">
          <Button onClick={onBack}>Zurück</Button>
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ borderRadius: 3 }}
          >
            Weiter
          </Button>
        </Stack>
      </Stack>
    </AppleCardGlass>
  );
}

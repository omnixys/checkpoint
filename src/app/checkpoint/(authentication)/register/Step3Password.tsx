"use client";

import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { JSX, useState } from "react";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { SignUpStep3 } from "@/types/authentication/auth.type";
import { validateStep3 } from "./signup.logic";
import { AppleCardGlass } from "./signup.style";

interface Props {
  value: SignUpStep3;
  onChange: (v: SignUpStep3) => void;
  onBack: () => void;
  onFinish: () => void;
}

export function Step3Password({
  value,
  onChange,
  onBack,
  onFinish,
}: Props): JSX.Element {
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof SignUpStep3, val: string): void => {
    onChange({ ...value, [field]: val });
  };

  const handleFinish = (): void => {
    const err = validateStep3(value);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onFinish();
  };

  return (
    <AppleCardGlass>
      <Stack spacing={3}>
        <Typography variant="h6" fontWeight={600} textAlign="center">
          Schritt 3 – Passwort setzen
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Passwort"
          type={showPw ? "text" : "password"}
          value={value.password}
          onChange={(e) => update("password", e.target.value)}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPw((p) => !p)}>
                  {showPw ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Passwort bestätigen"
          type={showPw2 ? "text" : "password"}
          value={value.passwordConfirm}
          onChange={(e) => update("passwordConfirm", e.target.value)}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPw2((p) => !p)}>
                  {showPw2 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" justifyContent="space-between">
          <Button onClick={onBack}>Zurück</Button>

          <Button
            variant="contained"
            onClick={handleFinish}
            sx={{ borderRadius: 3 }}
          >
            Registrieren
          </Button>
        </Stack>
      </Stack>
    </AppleCardGlass>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { JSX } from "react";

import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { env } from "@/checkpoint/lib/env";
import { AppleButton } from "@/checkpoint/components/apple/AppleButton";
import { AppleCard } from "@/checkpoint/components/apple/AppleCard";
import { setCurrentUser } from "@/checkpoint/lib/apollo/auth-context";
import { AuthManager } from "@/checkpoint/lib/auth/AuthManager";
import { getCurrentUser } from "@/checkpoint/lib/auth/get-current-user";

export default function LoginForm(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect") || env.CHECKPOINT_BASE_PATH;

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function submitForm(): Promise<void> {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      await AuthManager.login({ username, password });
      const user = await getCurrentUser();

      setCurrentUser(user);
      router.replace(redirect);
    } catch (e) {
      console.error(e);
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppleCard>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submitForm();
        }}
      >
        <Stack spacing={3} sx={{ width: 360, maxWidth: "90vw" }}>
          <Typography variant="h5" sx={{ fontWeight: 700, textAlign: "center" }}>
            Willkommen
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Benutzername"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            slotProps={{
              input: {
                sx: { borderRadius: "14px" },
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonRoundedIcon />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label="Passwort"
            type={showPw ? "text" : "password"}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                sx: { borderRadius: "14px" },
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw((p) => !p)} edge="end">
                      {showPw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            variant="text"
            sx={{
              textAlign: "left",
              justifyContent: "flex-start",
              paddingLeft: 0,
              color: "text.secondary",
              textTransform: "none",
              fontSize: "0.85rem",
              mt: -2,
            }}
            onClick={() => router.push(`${env.CHECKPOINT_BASE_PATH}forgot-password`)}
          >
            Passwort vergessen?
          </Button>

          <AppleButton type="submit" fullWidth variant="accent" disabled={loading}>
            {loading ? "..." : "Anmelden"}
          </AppleButton>

          <AppleButton
            fullWidth
            variant="ghost"
            onClick={() => router.push(env.CHECKPOINT_BASE_PATH)}
          >
            Zurück zur Startseite
          </AppleButton>
        </Stack>
      </form>
    </AppleCard>
  );
}

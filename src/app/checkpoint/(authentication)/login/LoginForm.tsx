"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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
import React, { JSX } from "react";

import { LoginInput } from "@/types/authentication/auth-input.type";
import { AuthManager } from "@/utils/AuthManager";
import { AppleButton } from "@/components/apple/AppleButton";
import { AppleCard } from "@/components/apple/AppleCard";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function LoginForm(): JSX.Element {
  const { refetchMe } = useAuth();
    const router = useRouter();
  

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function submitForm(): Promise<void> {
    try {
      setLoading(true);
      setError(null);

      const input: LoginInput = { username, password };
      await AuthManager.login(input);

      await refetchMe();
      window.location.href = "/checkpoint";
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
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, textAlign: "center" }}
          >
            Willkommen
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Benutzername"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              sx: { borderRadius: "14px" },
              startAdornment: (
                <InputAdornment position="start">
                  <PersonRoundedIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Passwort"
            type={showPw ? "text" : "password"}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
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
            }}
          />

          {/* Passwort vergessen */}
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
            onClick={() => router.push("/checkpoint/forgot-password")}
          >
            Passwort vergessen?
          </Button>

          {/* === LOGIN BUTTON === */}
          <AppleButton
            type="submit"
            fullWidth
            variant="accent"
            disabled={loading}
            onClick={() => void submitForm()}
          >
            {loading ? "..." : "Anmelden"}
          </AppleButton>

          {/* === BACK TO HOME BUTTON === */}
          <AppleButton
            fullWidth
            variant="ghost"
            onClick={() => (window.location.href = "/checkpoint")}
          >
            Zurück zur Startseite
          </AppleButton>
        </Stack>
      </form>
    </AppleCard>
  );
}

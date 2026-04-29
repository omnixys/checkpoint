"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { JSX } from "react";
import { motion } from "framer-motion";

import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import {
  Alert,
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import { env } from "@/checkpoint/lib/env";
import { AppleButton } from "@/checkpoint/components/apple/AppleButton";
import { AppleCard } from "@/checkpoint/components/apple/AppleCard";
import { setCurrentUser } from "@/checkpoint/lib/apollo/auth-context";
import { AuthManager } from "@/checkpoint/lib/auth/AuthManager";
import { getCurrentUser } from "@/checkpoint/lib/auth/get-current-user";
import { useThemeMode } from "@/checkpoint/providers/ThemeModeProvider";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

export default function LoginForm(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const { scheme } = useThemeMode();
  const t = useTypedTranslations("auth");

  const redirect = searchParams.get("redirect") || env.CHECKPOINT_BASE_PATH;

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [focused, setFocused] = React.useState<string | null>(null);

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
      setError(t("login.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: `
          radial-gradient(circle at 20% 30%, ${theme.palette.primary.main}22, transparent 40%),
          radial-gradient(circle at 80% 70%, ${theme.palette.secondary.main}22, transparent 40%),
          ${theme.palette.background.default}
        `,
      }}
    >
      {/* Glow */}
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: theme.palette.primary.main,
          filter: "blur(160px)",
          top: "-10%",
          left: "-10%",
          zIndex: 0,
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{ zIndex: 1 }}
      >
        <AppleCard>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submitForm();
            }}
          >
            <Stack spacing={3} sx={{ width: 380, maxWidth: "90vw" }}>
              {/* Branding */}
              <Stack spacing={1} sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {t("login.title")}
                </Typography>

                <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>
                  {t("login.subtitle")}
                </Typography>
              </Stack>

              {/* Error */}
              {error && (
                <motion.div initial={{ x: 0 }} animate={{ x: [-8, 8, -6, 6, 0] }}>
                  <Alert severity="error">{error}</Alert>
                </motion.div>
              )}

              {/* Username */}
              <TextField
                label={t("login.username")}
                fullWidth
                value={username}
                onFocus={() => setFocused("username")}
                onBlur={() => setFocused(null)}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    transition: "all 0.3s",
                    boxShadow:
                      focused === "username" ? `0 0 0 2px ${theme.palette.primary.main}55` : "none",
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonRoundedIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* Password */}
              <TextField
                label={t("login.password")}
                type={showPw ? "text" : "password"}
                fullWidth
                value={password}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    transition: "all 0.3s",
                    boxShadow:
                      focused === "password" ? `0 0 0 2px ${theme.palette.primary.main}55` : "none",
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPw((p) => !p)}>
                          {showPw ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* CTA */}
              <motion.div whileTap={{ scale: 0.96 }}>
                <AppleButton type="submit" fullWidth variant="accent" disabled={loading}>
                  {loading ? t("login.submitLoading") : t("login.submit")}
                </AppleButton>
              </motion.div>

              {/* Secondary */}
              <AppleButton
                fullWidth
                variant="ghost"
                onClick={() => router.push(env.CHECKPOINT_BASE_PATH)}
              >
                {t("login.back")}
              </AppleButton>
            </Stack>
          </form>
        </AppleCard>
      </motion.div>
    </Box>
  );
}

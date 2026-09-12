"use client";

import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import Link from "next/link";
import type { JSX } from "react";
import { AppleButton } from "@/checkpoint/components/apple/AppleButton";
import { AppleCard } from "@/checkpoint/components/apple/AppleCard";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { env } from "@/checkpoint/lib/env";
import type { LoginFormState } from "./useLoginForm";

export interface LoginFormCardProps {
  readonly form: LoginFormState;
  readonly onBack: () => void;
}

export function LoginFormCard({ form, onBack }: LoginFormCardProps): JSX.Element {
  const theme = useTheme();
  const t = useTypedTranslations("auth");
  const {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    focused,
    setFocused,
    loading,
    usernameError,
    passwordError,
    submit,
  } = form;

  return (
    <AppleCard>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <Stack spacing={3} sx={{ width: "100%", minWidth: 0 }}>
          {/* Username */}
          <TextField
            label={t("login.username")}
            name="username"
            autoComplete="username"
            fullWidth={true}
            value={username}
            error={usernameError !== undefined}
            helperText={usernameError}
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
            name="password"
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            fullWidth={true}
            value={password}
            error={passwordError !== undefined}
            helperText={passwordError}
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
                    <IconButton
                      onClick={toggleShowPassword}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* CTA */}
          <motion.div whileTap={{ scale: 0.96 }}>
            <AppleButton type="submit" fullWidth={true} variant="accent" disabled={loading}>
              {loading ? t("login.submitLoading") : t("login.submit")}
            </AppleButton>
          </motion.div>

          {/* Secondary */}
          <AppleButton fullWidth={true} variant="ghost" onClick={onBack}>
            {t("login.back")}
          </AppleButton>

          {/* Privacy Hint */}
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", mt: 2 }}>
            {t("login.privacyNote")}{" "}
            <Link
              href={`${env.CHECKPOINT_BASE_PATH}privacy`}
              style={{ textDecoration: "underline" }}
            >
              {t("login.privacyLink")}
            </Link>
          </Typography>
        </Stack>
      </form>
    </AppleCard>
  );
}

"use client";

import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { motion, useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();
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
    mode,
    setMode,
    guestIdentifier,
    setGuestIdentifier,
    guestFirstName,
    setGuestFirstName,
    guestLastName,
    setGuestLastName,
    guestLoading,
    guestSent,
    guestInvalid,
    guestNameRequired,
    guestNetworkError,
    submitGuest,
  } = form;

  const isGuestMode = mode === "guest";
  const guestLooksLikePhone = guestIdentifier.trimStart().startsWith("+");

  return (
    <AppleCard>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void (isGuestMode ? submitGuest() : submit());
        }}
      >
        <Stack spacing={3} sx={{ width: "100%", minWidth: 0 }}>
          {isGuestMode ? (
            <>
              <Stack spacing={0.5}>
                <Typography variant="h6">{t("login.guestTitle")}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("login.guestSubtitle")}
                </Typography>
              </Stack>

              <TextField
                label={t("login.guestIdentifier")}
                name="guestIdentifier"
                type={guestLooksLikePhone ? "tel" : "email"}
                autoComplete={guestLooksLikePhone ? "tel" : "email"}
                fullWidth={true}
                value={guestIdentifier}
                error={guestInvalid}
                helperText={guestInvalid ? t("login.guestInvalid") : undefined}
                onChange={(event) => setGuestIdentifier(event.target.value)}
                slotProps={{
                  htmlInput: {
                    inputMode: guestLooksLikePhone ? "tel" : "email",
                    spellCheck: false,
                  },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        {guestLooksLikePhone ? (
                          <SmartphoneRoundedIcon aria-hidden={true} />
                        ) : (
                          <AlternateEmailRoundedIcon aria-hidden={true} />
                        )}
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {guestLooksLikePhone ? (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label={t("login.guestFirstName")}
                    name="guestFirstName"
                    autoComplete="given-name"
                    fullWidth={true}
                    value={guestFirstName}
                    error={guestNameRequired}
                    onChange={(event) => setGuestFirstName(event.target.value)}
                    slotProps={{ htmlInput: { spellCheck: false } }}
                  />
                  <TextField
                    label={t("login.guestLastName")}
                    name="guestLastName"
                    autoComplete="family-name"
                    fullWidth={true}
                    value={guestLastName}
                    error={guestNameRequired}
                    onChange={(event) => setGuestLastName(event.target.value)}
                    slotProps={{ htmlInput: { spellCheck: false } }}
                  />
                </Stack>
              ) : null}
              {guestNameRequired ? (
                <Alert severity="info">{t("login.guestNameRequired")}</Alert>
              ) : null}

              {guestSent ? (
                <Alert severity="success" role="status" aria-live="polite">
                  {t("login.guestSuccess")}
                </Alert>
              ) : null}
              {guestNetworkError ? (
                <Alert severity="error">{t("login.guestNetworkError")}</Alert>
              ) : null}

              <motion.div {...(reduceMotion ? {} : { whileTap: { scale: 0.96 } })}>
                <AppleButton
                  type="submit"
                  fullWidth={true}
                  variant="accent"
                  disabled={guestLoading}
                  icon={guestLoading ? <CircularProgress size={20} color="inherit" /> : undefined}
                >
                  {guestLoading ? t("login.guestSubmitLoading") : t("login.guestSubmit")}
                </AppleButton>
              </motion.div>
            </>
          ) : (
            <>
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
                    transition: theme.transitions.create("box-shadow", {
                      duration: theme.transitions.duration.short,
                    }),
                    boxShadow:
                      focused === "username"
                        ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.33)}`
                        : "none",
                  },
                }}
                slotProps={{
                  htmlInput: { spellCheck: false },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonRoundedIcon aria-hidden={true} />
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
                    transition: theme.transitions.create("box-shadow", {
                      duration: theme.transitions.duration.short,
                    }),
                    boxShadow:
                      focused === "password"
                        ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.33)}`
                        : "none",
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon aria-hidden={true} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleShowPassword}
                          aria-label={
                            showPassword ? t("login.hidePassword") : t("login.showPassword")
                          }
                        >
                          {showPassword ? (
                            <VisibilityOff aria-hidden={true} />
                          ) : (
                            <Visibility aria-hidden={true} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* CTA */}
              <motion.div {...(reduceMotion ? {} : { whileTap: { scale: 0.96 } })}>
                <AppleButton
                  type="submit"
                  fullWidth={true}
                  variant="accent"
                  disabled={loading}
                  icon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
                >
                  {loading ? t("login.submitLoading") : t("login.submit")}
                </AppleButton>
              </motion.div>
            </>
          )}

          <AppleButton
            type="button"
            fullWidth={true}
            variant="tonal"
            onClick={() => setMode(isGuestMode ? "credentials" : "guest")}
          >
            {isGuestMode ? t("login.credentialsToggle") : t("login.guestToggle")}
          </AppleButton>

          {/* Secondary */}
          <AppleButton type="button" fullWidth={true} variant="ghost" onClick={onBack}>
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

"use client";

import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  alpha,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { JSX } from "react";
import { AppleButton } from "@/checkpoint/components/apple/AppleButton";
import { AppleCard } from "@/checkpoint/components/apple/AppleCard";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { env } from "@/checkpoint/lib/env";
import type { CallingCodeCountry } from "@/checkpoint/types/country.type";
import { stripNonDigits } from "@/checkpoint/utils/input/numericInput";
import type { LoginFormState } from "./useLoginForm";

export interface LoginFormCardProps {
  readonly form: LoginFormState;
  readonly onBack: () => void;
  readonly callingCodeCountries: ReadonlyArray<CallingCodeCountry>;
}

export function LoginFormCard({
  form,
  onBack,
  callingCodeCountries,
}: LoginFormCardProps): JSX.Element {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const t = useTypedTranslations("auth");
  const {
    mode,
    setMode,
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
    guestTab,
    setGuestTab,
    guestEmail,
    setGuestEmail,
    guestCallingCode,
    setGuestCallingCode,
    guestPhoneNumber,
    setGuestPhoneNumber,
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
  const isTelTab = guestTab === "tel";

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

              {/* Identifier method toggle */}
              <Stack
                direction="row"
                role="tablist"
                aria-label={t("login.guestTabLabel")}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  component="button"
                  type="button"
                  role="tab"
                  aria-selected={guestTab === "tel"}
                  tabIndex={guestTab === "tel" ? 0 : -1}
                  sx={{
                    flex: 1,
                    py: 1,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    color: guestTab === "tel" ? "primary.contrastText" : "text.secondary",
                    bgcolor: guestTab === "tel" ? "primary.main" : "transparent",
                    transition: theme.transitions.create(["color", "background-color"], {
                      duration: theme.transitions.duration.short,
                    }),
                    border: "none",
                    cursor: "pointer",
                    "&:focus-visible": {
                      outline: `2px solid ${alpha(theme.palette.primary.main, 0.6)}`,
                      outlineOffset: -2,
                    },
                  }}
                  onClick={() => setGuestTab("tel")}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <SmartphoneRoundedIcon fontSize="small" aria-hidden={true} />
                    <span>{t("login.guestTabTel")}</span>
                  </Stack>
                </Box>
                <Box
                  component="button"
                  type="button"
                  role="tab"
                  aria-selected={guestTab === "email"}
                  tabIndex={guestTab === "email" ? 0 : -1}
                  sx={{
                    flex: 1,
                    py: 1,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    color: guestTab === "email" ? "primary.contrastText" : "text.secondary",
                    bgcolor: guestTab === "email" ? "primary.main" : "transparent",
                    transition: theme.transitions.create(["color", "background-color"], {
                      duration: theme.transitions.duration.short,
                    }),
                    border: "none",
                    cursor: "pointer",
                    "&:focus-visible": {
                      outline: `2px solid ${alpha(theme.palette.primary.main, 0.6)}`,
                      outlineOffset: -2,
                    },
                  }}
                  onClick={() => setGuestTab("email")}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <AlternateEmailRoundedIcon fontSize="small" aria-hidden={true} />
                    <span>{t("login.guestTabEmail")}</span>
                  </Stack>
                </Box>
              </Stack>

              {isTelTab ? (
                <>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      select={true}
                      label={t("login.guestCallingCode")}
                      name="guestCallingCode"
                      fullWidth={true}
                      value={guestCallingCode}
                      error={guestInvalid}
                      onChange={(e) => setGuestCallingCode(e.target.value)}
                      slotProps={{
                        select: {
                          renderValue: (selected): JSX.Element => {
                            const code = String(selected);
                            const country = callingCodeCountries.find(
                              (c) => c.callingCode === code,
                            );
                            return (
                              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                {country?.flagSvg ? (
                                  <Box
                                    component="img"
                                    src={country.flagSvg}
                                    alt=""
                                    sx={{ height: 18, width: 24, objectFit: "contain" }}
                                  />
                                ) : null}
                                <span>{code}</span>
                              </Stack>
                            );
                          },
                          IconComponent: KeyboardArrowDownRoundedIcon,
                          inputProps: { spellCheck: false },
                        },
                      }}
                    >
                      {callingCodeCountries.map((country) => (
                        <MenuItem
                          key={country.iso2}
                          value={country.callingCode ?? ""}
                          sx={{ gap: 1, alignItems: "center" }}
                        >
                          {country.flagSvg ? (
                            <Box
                              component="img"
                              src={country.flagSvg}
                              alt=""
                              sx={{ height: 18, width: 24, objectFit: "contain" }}
                            />
                          ) : null}
                          <Typography variant="body2">({country.callingCode})</Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {country.name}
                          </Typography>
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      label={t("login.guestPhoneNumber")}
                      name="guestPhoneNumber"
                      autoComplete="tel-national"
                      fullWidth={true}
                      value={guestPhoneNumber}
                      error={guestInvalid}
                      helperText={guestInvalid ? t("login.guestInvalid") : undefined}
                      onChange={(e) => setGuestPhoneNumber(stripNonDigits(e.target.value))}
                      slotProps={{
                        htmlInput: { inputMode: "tel", spellCheck: false },
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <SmartphoneRoundedIcon aria-hidden={true} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Stack>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      label={t("login.guestFirstName")}
                      name="guestFirstName"
                      autoComplete="given-name"
                      fullWidth={true}
                      value={guestFirstName}
                      error={guestNameRequired}
                      onChange={(e) => setGuestFirstName(e.target.value)}
                      slotProps={{ htmlInput: { spellCheck: false } }}
                    />
                    <TextField
                      label={t("login.guestLastName")}
                      name="guestLastName"
                      autoComplete="family-name"
                      fullWidth={true}
                      value={guestLastName}
                      error={guestNameRequired}
                      onChange={(e) => setGuestLastName(e.target.value)}
                      slotProps={{ htmlInput: { spellCheck: false } }}
                    />
                  </Stack>
                </>
              ) : (
                <TextField
                  label={t("login.guestEmail")}
                  name="guestEmail"
                  autoComplete="email"
                  fullWidth={true}
                  value={guestEmail}
                  error={guestInvalid}
                  helperText={guestInvalid ? t("login.guestInvalid") : undefined}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  slotProps={{
                    htmlInput: { inputMode: "email", spellCheck: false },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <AlternateEmailRoundedIcon aria-hidden={true} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}

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

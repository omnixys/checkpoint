"use client";

import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  alpha,
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { type JSX } from "react";
import { AppleButton } from "@/checkpoint/components/apple/AppleButton";
import { AppleCard } from "@/checkpoint/components/apple/AppleCard";
import type { AppError } from "@/checkpoint/errors/app-error";
import { useFieldError, useMutationError } from "@/checkpoint/hooks/error";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { setCurrentUser } from "@/checkpoint/lib/apollo/auth-context";
import { AuthManager } from "@/checkpoint/lib/auth/AuthManager";
import { getCurrentUser } from "@/checkpoint/lib/auth/get-current-user";
import { env } from "@/checkpoint/lib/env";
import { useAnalytics } from "@/checkpoint/providers/AnalyticsProvider";

const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;

export default function LoginForm(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const t = useTypedTranslations("auth");
  const analytics = useAnalytics();
  const reduceMotion = useReducedMotion();

  const redirect = searchParams.get("redirect") || env.CHECKPOINT_BASE_PATH;

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [appError, setAppError] = React.useState<AppError | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [focused, setFocused] = React.useState<string | null>(null);
  const handleMutationError = useMutationError({ operationName: "CredentialsLogin" });
  const usernameError = useFieldError(appError, "username");
  const passwordError = useFieldError(appError, "password");

  async function submitForm(): Promise<void> {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setAppError(null);
      analytics.track("LoginStarted");

      await AuthManager.login({ username, password });
      const user = await getCurrentUser();

      setCurrentUser(user);
      analytics.track("LoginSucceeded");

      router.replace(redirect);
    } catch (e) {
      analytics.track("LoginFailed", { errorCode: "AUTHENTICATION_FAILED" });
      setAppError(handleMutationError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 3, lg: 10 },
        position: "relative",
        overflow: "hidden",
        width: "100%",
        px: 2,
        py: "calc(24px + env(safe-area-inset-top))",
        background: `
          radial-gradient(circle at 18% 28%, ${alpha(theme.palette.primary.main, 0.14)}, transparent 42%),
          radial-gradient(circle at 82% 72%, ${alpha(theme.palette.secondary.main, 0.12)}, transparent 40%),
          radial-gradient(circle at 55% 15%, ${alpha(theme.palette.primary.main, 0.08)}, transparent 32%),
          ${theme.palette.background.default}
        `,
      }}
    >
      {/* Decorative grid texture (masked to the top) */}
      <Box
        aria-hidden={true}
        sx={{
          backgroundImage: `linear-gradient(${alpha(theme.palette.text.primary, 0.035)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.text.primary, 0.035)} 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          inset: 0,
          maskImage: "linear-gradient(to bottom, black, transparent 58%)",
          pointerEvents: "none",
          position: "absolute",
          zIndex: 0,
        }}
      />

      {/* Glow */}
      <motion.div
        animate={reduceMotion ? { opacity: 0.5 } : { opacity: [0.4, 0.7, 0.4] }}
        transition={{
          duration: reduceMotion ? 0 : 6,
          repeat: reduceMotion ? 0 : Number.POSITIVE_INFINITY,
        }}
        style={{
          position: "absolute",
          width: "min(600px, 120vw)",
          height: "min(600px, 120vw)",
          borderRadius: "50%",
          background: theme.palette.primary.main,
          filter: "blur(160px)",
          top: "-10%",
          left: "-10%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Branding panel: left/above the form depending on breakpoint */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 2,
          textAlign: { xs: "center", lg: "left" },
          maxWidth: { xs: 420, sm: 480, lg: 420 },
          width: "100%",
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        {reduceMotion ? (
          <Branding theme={theme} t={t} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: CINEMATIC_EASE }}
          >
            <Branding theme={theme} t={t} />
          </motion.div>
        )}
      </Box>

      {/* Card */}
      <Box
        sx={{
          zIndex: 1,
          width: "100%",
          maxWidth: { xs: 420, sm: 480, lg: 420 },
          flexShrink: 0,
        }}
      >
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: CINEMATIC_EASE }}
          style={{ width: "100%" }}
        >
          <AppleCard>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submitForm();
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
                        focused === "username"
                          ? `0 0 0 2px ${theme.palette.primary.main}55`
                          : "none",
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
                  type={showPw ? "text" : "password"}
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
                        focused === "password"
                          ? `0 0 0 2px ${theme.palette.primary.main}55`
                          : "none",
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
                            onClick={() => setShowPw((p) => !p)}
                            aria-label="Toggle password visibility"
                          >
                            {showPw ? <VisibilityOff /> : <Visibility />}
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
                <AppleButton
                  fullWidth={true}
                  variant="ghost"
                  onClick={() => router.push(env.CHECKPOINT_BASE_PATH)}
                >
                  {t("login.back")}
                </AppleButton>

                {/* Privacy Hint */}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textAlign: "center", mt: 2 }}
                >
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
        </motion.div>
      </Box>
    </Box>
  );
}

function Branding({
  theme,
  t,
}: {
  theme: Theme;
  t: ReturnType<typeof useTypedTranslations<"auth">>;
}) {
  return (
    <Stack spacing={2} sx={{ alignItems: { xs: "center", lg: "flex-start" } }}>
      <Box
        component="img"
        src={theme.omnixys.visual.logo.src}
        alt="Omnixys"
        sx={{
          height: { xs: 40, lg: 48 },
          width: "auto",
          objectFit: "contain",
          filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.15))",
          alignSelf: "center",
          display: "block",
        }}
      />

      <Stack spacing={0.75}>
        <Typography
          sx={{
            color: "primary.main",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {t("login.subtitle")}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          {t("login.title")}
        </Typography>
      </Stack>

      <Box
        aria-hidden={true}
        sx={{
          background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
          height: 1,
          opacity: 0.72,
          width: { xs: 96, lg: 128 },
        }}
      />
    </Stack>
  );
}

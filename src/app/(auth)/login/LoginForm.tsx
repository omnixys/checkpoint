"use client";

import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import type { JSX } from "react";
import { LoginFormCard } from "@/checkpoint/components/auth/login/LoginFormCard";
import { useLoginForm } from "@/checkpoint/components/auth/login/useLoginForm";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { env } from "@/checkpoint/lib/env";
import type { CallingCodeCountry } from "@/checkpoint/types/country.type";

const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;

export default function LoginForm({
  callingCodeCountries,
}: {
  readonly callingCodeCountries: ReadonlyArray<CallingCodeCountry>;
}): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const t = useTypedTranslations("auth");
  const reduceMotion = useReducedMotion();

  const redirect = searchParams.get("redirect") || env.CHECKPOINT_BASE_PATH;
  const form = useLoginForm({ onSuccess: () => router.replace(redirect) });

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
          <LoginFormCard
            form={form}
            onBack={() => router.push(env.CHECKPOINT_BASE_PATH)}
            callingCodeCountries={callingCodeCountries}
          />
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

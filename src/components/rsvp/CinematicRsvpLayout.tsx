"use client";

import { alpha, Box, Container, Paper, Stack, Typography, useTheme } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;
const WEDDING_MONOGRAM = "C · R";

type CinematicRsvpLayoutProps = {
  children: ReactNode;
  controls: ReactNode;
  eventName: string;
  heroDescription: string;
  heroEyebrow: string;
};

type RsvpChapterProps = {
  children: ReactNode;
  description: string;
  index: string;
  title: string;
};

export function CinematicRsvpLayout({
  children,
  controls,
  eventName,
  heroDescription,
  heroEyebrow,
}: CinematicRsvpLayoutProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: "background.default",
        backgroundImage: `
          radial-gradient(circle at 12% 8%, ${alpha(theme.palette.primary.main, isDark ? 0.16 : 0.1)} 0, transparent 30%),
          radial-gradient(circle at 88% 28%, ${alpha(theme.palette.primary.main, isDark ? 0.09 : 0.06)} 0, transparent 26%),
          linear-gradient(180deg, ${alpha(theme.palette.background.default, 0)} 0%, ${alpha(theme.palette.background.paper, isDark ? 0.24 : 0.18)} 100%)
        `,
        color: "text.primary",
        minHeight: "100vh",
        overflow: "clip",
        position: "relative",
      }}
    >
      <Box
        aria-hidden={true}
        sx={{
          backgroundImage: `linear-gradient(${alpha(theme.palette.text.primary, 0.025)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.text.primary, 0.025)} 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          inset: 0,
          maskImage: "linear-gradient(to bottom, black, transparent 58%)",
          pointerEvents: "none",
          position: "absolute",
        }}
      />

      {controls}

      <Container
        maxWidth="lg"
        sx={{
          pb: { xs: 10, md: 16 },
          position: "relative",
          pt: { xs: 16, sm: 18, md: 22 },
          zIndex: 1,
        }}
      >
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 1.1, ease: CINEMATIC_EASE }}
        >
          <Stack
            component="header"
            spacing={{ xs: 2, md: 3 }}
            sx={{
              alignItems: "center",
              minHeight: { xs: "58vh", md: "68vh" },
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Typography
              aria-label="Caleb and Rachel"
              sx={{
                color: "primary.main",
                fontFamily: "var(--font-wedding-serif), Georgia, serif",
                fontSize: { xs: "1.2rem", md: "1.45rem" },
                letterSpacing: "0.32em",
                textTransform: "uppercase",
              }}
            >
              {WEDDING_MONOGRAM}
              <Typography component="span">
                #CALEBGETSRICH #HAPPELYEVERGYAMFI
              </Typography>
            </Typography>

            <Typography
              sx={{
                color: "primary.main",
                fontSize: { xs: "0.68rem", md: "0.75rem" },
                fontWeight: 700,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
              }}
            >
              {heroEyebrow}
            </Typography>

            <Typography
              component="h1"
              sx={{
                fontFamily: "var(--font-wedding-serif), Georgia, serif",
                fontSize: "clamp(4.5rem, 18vw, 12rem)",
                fontWeight: 400,
                letterSpacing: "-0.065em",
                lineHeight: 0.84,
                maxWidth: "100%",
                overflowWrap: "anywhere",
              }}
            >
              RSVP
            </Typography>

            <Typography
              component="p"
              sx={{
                fontFamily: "var(--font-wedding-serif), Georgia, serif",
                fontSize: "clamp(1.45rem, 4vw, 2.75rem)",
                lineHeight: 1.2,
                maxWidth: 760,
                overflowWrap: "anywhere",
              }}
            >
              {eventName}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                fontSize: { xs: "1rem", md: "1.1rem" },
                lineHeight: 1.8,
                maxWidth: 580,
              }}
            >
              {heroDescription}
            </Typography>

            <Box
              aria-hidden={true}
              sx={{
                background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
                height: 1,
                mt: { xs: 2, md: 4 },
                opacity: 0.72,
                width: { xs: 110, md: 160 },
              }}
            />
          </Stack>
        </motion.div>

        <Stack spacing={{ xs: 3, md: 5 }}>{children}</Stack>
      </Container>
    </Box>
  );
}

export function RsvpChapter({ children, description, index, title }: RsvpChapterProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const headingId = `rsvp-chapter-${index}`;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.12, once: true }}
      transition={{ duration: reduceMotion ? 0 : 0.85, ease: CINEMATIC_EASE }}
    >
      <Paper
        aria-labelledby={headingId}
        component="section"
        elevation={0}
        sx={{
          background: alpha(
            theme.palette.background.paper,
            theme.palette.mode === "dark" ? 0.78 : 0.88,
          ),
          border: "1px solid",
          borderColor: alpha(theme.palette.primary.main, 0.22),
          borderRadius: { xs: 3, md: 5 },
          boxShadow:
            theme.palette.mode === "dark"
              ? `0 34px 90px ${alpha("#000000", 0.48)}`
              : `0 34px 90px ${alpha(theme.palette.primary.main, 0.12)}`,
          overflow: "hidden",
          p: { xs: 2.5, sm: 4, md: 6 },
          position: "relative",
        }}
      >
        <Box
          aria-hidden={true}
          sx={{
            background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.9)}, transparent)`,
            height: 1,
            left: 0,
            position: "absolute",
            top: 0,
            width: { xs: "42%", md: "28%" },
          }}
        />

        <Stack spacing={{ xs: 3, md: 4 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 1.5, md: 4 }}
            sx={{ alignItems: { md: "flex-start" } }}
          >
            <Typography
              aria-hidden={true}
              sx={{
                color: "primary.main",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.24em",
                pt: { md: 1 },
              }}
            >
              {index}
            </Typography>

            <Stack spacing={1.25} sx={{ maxWidth: 700 }}>
              <Typography
                component="h2"
                id={headingId}
                sx={{
                  fontFamily: "var(--font-wedding-serif), Georgia, serif",
                  fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
                  fontWeight: 400,
                  lineHeight: 1.08,
                  overflowWrap: "anywhere",
                }}
              >
                {title}
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.75, maxWidth: 620 }}>
                {description}
              </Typography>
            </Stack>
          </Stack>

          {children}
        </Stack>
      </Paper>
    </motion.div>
  );
}

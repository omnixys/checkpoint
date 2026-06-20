"use client";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { alpha, Box, Button, Container, Paper, Stack, Typography, useTheme } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { env } from "@/checkpoint/lib/env";
import { triggerAccentPulse } from "@/checkpoint/themes/accent-animation";
import Confetti from "react-confetti";

const WEDDING_MONOGRAM = "C · R";

export default function RSVPSuccessPage() {
  const t = useTypedTranslations("rsvp");
  const theme = useTheme();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    triggerAccentPulse(theme.palette.primary.main);
  }, [theme.palette.primary.main]);

  return (
    <Box
      component="main"
      sx={{
        alignItems: "center",
        backgroundColor: "background.default",
        backgroundImage: `radial-gradient(circle at 50% 18%, ${alpha(theme.palette.primary.main, 0.2)}, transparent 36%)`,
        display: "flex",
        minHeight: "100vh",
        overflow: "hidden",
        py: 8,
        position: "relative",
      }}
    >

<Confetti
          numberOfPieces={1350}
          recycle={false}
          gravity={0.15}
          colors={["#c89b3c", "#e5c275", "#ffffff", "#f5f0e6", "#d9b46a"]}
        />
        
      <Container maxWidth="sm">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Paper
            elevation={0}
            sx={{
              background: alpha(theme.palette.background.paper, 0.82),
              border: "1px solid",
              borderColor: alpha(theme.palette.primary.main, 0.28),
              borderRadius: { xs: 3, sm: 5 },
              p: { xs: 4, sm: 7 },
              textAlign: "center",
            }}
          >
            <Stack spacing={3} sx={{ alignItems: "center" }}>
              <Box
                aria-hidden={true}
                sx={{
                  alignItems: "center",
                  border: "1px solid",
                  borderColor: alpha(theme.palette.primary.main, 0.54),
                  borderRadius: "50%",
                  color: "primary.main",
                  display: "flex",
                  height: 64,
                  justifyContent: "center",
                  width: 64,
                }}
              >
                <CheckRoundedIcon fontSize="large" />
              </Box>

              <Typography
                sx={{
                  color: "primary.main",
                  fontFamily: "var(--font-wedding-serif), Georgia, serif",
                  fontSize: "1.15rem",
                  letterSpacing: "0.28em",
                }}
              >
                {WEDDING_MONOGRAM}
              </Typography>

              <Typography
                component="h1"
                sx={{
                  fontFamily: "var(--font-wedding-serif), Georgia, serif",
                  fontSize: "clamp(2.5rem, 9vw, 5rem)",
                  fontWeight: 400,
                  lineHeight: 1,
                }}
              >
                {t("success.title")}
              </Typography>

              <Typography color="text.secondary" sx={{ lineHeight: 1.8, maxWidth: 420 }}>
                {t("success.description")}
              </Typography>

                 <Typography color="text.secondary" sx={{ 
                  lineHeight: 1.8,
                  maxWidth: 420,                   
                  fontFamily: "var(--font-wedding-serif), Georgia, serif",
                  fontSize: "1.15rem", 
                  color: theme.palette.primary.main,
                  }}>
               #CALEBGETSRICH  {<br/>}       #HAPPELYEVERGYAMFI
              </Typography>

              <Box
                aria-hidden={true}
                sx={{
                  background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
                  height: 1,
                  my: 1,
                  width: 120,
                }}
              />

              <Button
                component={Link}
                href={env.CHECKPOINT_BASE_PATH}
                startIcon={<ArrowBackRoundedIcon />}
                variant="outlined"
              >
                {t("success.back")}
              </Button>
            </Stack>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

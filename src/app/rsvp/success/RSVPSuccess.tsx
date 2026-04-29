"use client";

import { Box, Button, Container, Typography, useTheme, alpha } from "@mui/material";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { triggerAccentPulse } from "@/checkpoint/themes/accent-animation";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { env } from "@/checkpoint/lib/env";

export default function RSVPSuccessPage() {
  const t = useTypedTranslations("rsvp");

  const theme = useTheme();
  const [width, height] = useWindowSize();
  const [run, setRun] = useState(true);

  useEffect(() => {
    triggerAccentPulse(theme.palette.primary.main);

    const t = setTimeout(() => setRun(false), 7000);
    return () => clearTimeout(t);
  }, [theme]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme.palette.background.default,
        position: "relative",
      }}
    >
      {run && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={550}
          recycle={true}
          colors={["#c89b3c", "#e5c275", "#ffffff", "#f5f0e6", "#d9b46a"]}
        />
      )}

      <Container maxWidth="sm">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Box
            sx={{
              p: 4,
              borderRadius: 4,
              background: alpha(theme.palette.background.paper, 0.7),
              backdropFilter: "blur(16px)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
              }}
            >
              🎉 {t("success.title")}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                fontWeight: 800,
                mt: 2,
              }}
            >
              {t("success.description")}
            </Typography>

            <Button
              component={Link}
              href={env.CHECKPOINT_BASE_PATH}
              variant="contained"
              sx={{ mt: 4 }}
            >
              {t("success.back")}
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

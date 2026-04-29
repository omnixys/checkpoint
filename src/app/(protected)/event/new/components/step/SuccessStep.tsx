"use client";

import { Box, Stack, Typography, useTheme, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import Confetti from "react-confetti";
import Link from "next/link";
import { env } from "@/checkpoint/lib/env";

type Props = {
  onCreateAnother: () => void;
  onViewEvent: () => void;
};

export default function SuccessStep({ eventId }: { eventId: string | undefined }) {
  const theme = useTheme();
  const t = useTypedTranslations("create");

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      sx={{
        width: "100%",
        maxWidth: 720,
        mx: "auto",
        textAlign: "center",
      }}
    >
      {/* CONTENT */}
      <Stack
        spacing={4}
        sx={{
          alignItems: "center",
          mt: 8,
        }}
      >
        <Confetti recycle={false} numberOfPieces={1320} />
        {/* ICON / VISUAL */}
        <Box
          component={motion.div}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: theme.palette.success.main,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 32,
              fontWeight: 700,
              color: theme.palette.common.white,
            }}
          >
            ✓
          </Typography>
        </Box>

        {/* TITLE */}
        <Typography
          sx={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: theme.palette.text.primary,
          }}
        >
          {t("success.title")}
        </Typography>

        {/* SUBTITLE */}
        <Typography
          sx={{
            fontSize: 14,
            color: theme.palette.text.secondary,
            maxWidth: 420,
          }}
        >
          {t("success.subtitle")}
        </Typography>

        {/* ACTIONS */}
        <Stack
          spacing={2}
          sx={{
            width: "100%",
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{
              borderRadius: 3,
              py: 1.4,
              textTransform: "none",
              fontSize: 15,
            }}
          >
            <Link href={`${env.CHECKPOINT_BASE_PATH}event/eventId`}>{t("actions.viewEvent")}</Link>
          </Button>

          <Button
            variant="outlined"
            sx={{
              borderRadius: 3,
              py: 1.4,
              textTransform: "none",
              fontSize: 15,
            }}
          >
            <Link href={`${env.CHECKPOINT_BASE_PATH}event/new`}>{t("actions.createAnother")}</Link>
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

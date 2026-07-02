"use client";

import { Box, Button, Stack, Typography, useTheme, alpha } from "@mui/material";
import { motion } from "framer-motion";
import RefreshIcon from "@mui/icons-material/Refresh";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import { useRouter } from "next/navigation";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { env } from "@/checkpoint/lib/env";

export default function NetworkErrorPage() {
  const theme = useTheme();
  const router = useRouter();
  const t = useTypedTranslations("error");

  const handleRetry = () => {
    router.refresh();
    window.location.reload();
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background: theme.palette.background.default,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        style={{ width: "100%", maxWidth: 420 }}
      >
        <Stack
          spacing={3}
          sx={{
            p: 4,
            borderRadius: "24px",
            backdropFilter: "blur(16px)",
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
            border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 30px 80px rgba(0,0,0,0.6)"
                : "0 30px 80px rgba(0,0,0,0.1)",
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: alpha(theme.palette.error.main, 0.12),
            }}
          >
            <WifiOffIcon
              sx={{
                fontSize: 36,
                color: theme.palette.error.main,
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              letterSpacing: 0,
            }}
          >
            {t("network.title")}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 320,
            }}
          >
            {t("network.message")}
          </Typography>

          {/* Actions */}
          <Stack spacing={1.5}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<RefreshIcon />}
              onClick={handleRetry}
              sx={{ height: 48 }}
            >
              {t("network.actions.retry")}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => router.push(env.CHECKPOINT_BASE_PATH)}
              sx={{ height: 48 }}
            >
              {t("network.actions.home")}
            </Button>
          </Stack>
        </Stack>
      </motion.div>
    </Box>
  );
}

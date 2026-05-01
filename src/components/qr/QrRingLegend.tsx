"use client";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

const LEGEND_DOT_SIZE = 10;

export default function QrRingLegend() {
  const theme = useTheme();
  const tQr = useTypedTranslations("qr");

  const items = [
    { label: tQr("outerRing"), color: theme.palette.primary.main },
    { label: tQr("innerRing"), color: theme.palette.secondary.main },
    { label: tQr("criticalRing"), color: theme.palette.error.main },
  ];

  return (
    <Tooltip
      arrow={true}
      placement="top"
      title={
        <Stack spacing={1} sx={{ p: 0.5 }}>
          {items.map((item) => (
            <Stack key={item.label} direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: LEGEND_DOT_SIZE,
                  height: LEGEND_DOT_SIZE,
                  borderRadius: "50%",
                  backgroundColor: item.color,
                }}
              />
              <Typography variant="caption">{item.label}</Typography>
            </Stack>
          ))}
        </Stack>
      }
      slotProps={{
        tooltip: {
          sx: {
            color: theme.palette.text.primary,
            backgroundColor: alpha(theme.palette.background.paper, 0.92),
            border: 1,
            borderColor: alpha(theme.palette.divider, 0.72),
            boxShadow: `0 ${theme.spacing(1.5)} ${theme.spacing(3.5)} ${alpha(
              theme.palette.common.black,
              theme.palette.mode === "dark" ? 0.34 : 0.16,
            )}`,
            backdropFilter: "blur(18px) saturate(150%)",
            WebkitBackdropFilter: "blur(18px) saturate(150%)",
          },
        },
        arrow: {
          sx: { color: alpha(theme.palette.background.paper, 0.92) },
        },
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          color: theme.palette.text.secondary,
          cursor: "help",
        }}
      >
        <InfoOutlinedIcon sx={{ width: theme.spacing(2), height: theme.spacing(2) }} />
        <Typography variant="caption" sx={{ fontWeight: 800 }}>
          {tQr("securityStatus")}
        </Typography>
      </Box>
    </Tooltip>
  );
}

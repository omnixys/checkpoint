"use client";

import { Box, Stack, Typography, Tooltip, useTheme } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function QrRingLegend() {
  const theme = useTheme();
  const omni = theme.palette.omnixys;
  const apple = theme.palette.apple;

  return (
    <Tooltip
      arrow
      placement="top"
      title={
        <Stack spacing={1} sx={{ p: 0.5 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: omni.primary,
              }}
            />
            <Typography fontSize={12}>
              Äußerer Ring: Nonce-Lebenszeit
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: omni.secondary,
              }}
            />
            <Typography fontSize={12}>
              Innerer Ring: Signatur-Gültigkeit
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: omni.error,
              }}
            />
            <Typography fontSize={12}>
              Rot pulsierend: Gleich ungültig
            </Typography>
          </Stack>
        </Stack>
      }
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: apple.systemBackground,
            color: omni.textPrimary,
            border: `1px solid ${apple.separator}`,
            boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
          },
        },
        arrow: {
          sx: { color: apple.systemBackground },
        },
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          color: omni.textSecondary,
          cursor: "help",
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 16 }} />
        <Typography fontSize={13}>Sicherheitsstatus</Typography>
      </Box>
    </Tooltip>
  );
}

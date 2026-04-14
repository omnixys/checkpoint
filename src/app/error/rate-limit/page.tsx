"use client";

import { Box, Button, Stack, Typography, useTheme, alpha } from "@mui/material";
import { useRouter } from "next/navigation";
import TimerIcon from "@mui/icons-material/Timer";

export default function RateLimitPage() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Stack
        spacing={3}
        sx={{
          p: 4,
          borderRadius: 24,
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
        }}
      >
        <TimerIcon sx={{ fontSize: 48, color: theme.palette.warning.main }} />

        <Typography variant="h5">Zu viele Anfragen</Typography>

        <Typography color="text.secondary">
          Bitte warte einen Moment und versuche es erneut.
        </Typography>

        <Button variant="contained" onClick={() => location.reload()}>
          Erneut versuchen
        </Button>
      </Stack>
    </Box>
  );
}

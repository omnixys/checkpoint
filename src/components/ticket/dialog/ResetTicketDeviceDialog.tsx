"use client";

import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ResetTicketDeviceDialog({ onCancel, onConfirm }: Props) {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3, minWidth: 320 }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <LockResetRoundedIcon sx={{ fontSize: 28, color: theme.palette.warning.main }} />
        <Typography variant="h6">Gerätebindung zurücksetzen?</Typography>
      </Stack>

      <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
        Das Ticket wird von dem gebundenen Gerät gelöst und kann anschließend auf einem anderen
        Gerät neu aktiviert werden.
      </Typography>

      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          justifyContent: "flex-end",
          mt: 3,
        }}
      >
        <Button onClick={onCancel}>Abbrechen</Button>
        <Button variant="contained" color="warning" onClick={onConfirm}>
          Zurücksetzen
        </Button>
      </Stack>
    </Box>
  );
}

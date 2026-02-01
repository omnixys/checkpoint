"use client";

import { Box, Stack, Typography, Button, useTheme } from "@mui/material";

type Props = {
  onCancel: () => void;
  onConfirm: () => void;
};

export default function RotateNonceDialog({ onCancel, onConfirm }: Props) {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3, minWidth: 320 }}>
      <Typography variant="h6" fontWeight={600}>
        Nonce rotieren?
      </Typography>

      <Typography
        variant="body2"
        sx={{ mt: 1, color: theme.palette.text.secondary }}
      >
        Dies setzt die Nonce aller Tickets in diesem Event zurück.
      </Typography>

      <Stack direction="row" justifyContent="flex-end" spacing={1.5} mt={3}>
        <Button onClick={onCancel}>Abbrechen</Button>
        <Button variant="contained" onClick={onConfirm}>
          Bestätigen
        </Button>
      </Stack>
    </Box>
  );
}

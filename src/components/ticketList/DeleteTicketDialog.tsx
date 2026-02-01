"use client";

import { Box, Stack, Typography, Button, useTheme } from "@mui/material";

type Props = {
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteTicketDialog({ onCancel, onConfirm }: Props) {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3, minWidth: 320 }}>
      <Typography variant="h6" fontWeight={600}>
        Ticket löschen?
      </Typography>

      <Typography
        variant="body2"
        sx={{ mt: 1, color: theme.palette.text.secondary }}
      >
        Dieses Ticket wird dauerhaft gelöscht.
      </Typography>

      <Stack direction="row" justifyContent="flex-end" spacing={1.5} mt={3}>
        <Button onClick={onCancel}>Abbrechen</Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          Löschen
        </Button>
      </Stack>
    </Box>
  );
}

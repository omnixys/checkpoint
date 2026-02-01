"use client";

import { Box, Stack, Typography, Button, useTheme } from "@mui/material";

type Props = {
  onCancel: () => void;
  onConfirm: () => void;
};

export default function CreateTicketDialog({ onCancel, onConfirm }: Props) {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3, minWidth: 300 }}>
      <Typography variant="h6" fontWeight={600}>
        Neues Ticket erstellen
      </Typography>

      <Typography
        variant="body2"
        sx={{ mt: 1, color: theme.palette.text.secondary }}
      >
        Möchtest du ein neues Ticket für dieses Event erstellen?
      </Typography>

      <Stack direction="row" justifyContent="flex-end" spacing={1.5} mt={3}>
        <Button onClick={onCancel}>Abbrechen</Button>
        <Button variant="contained" onClick={onConfirm}>
          Erstellen
        </Button>
      </Stack>
    </Box>
  );
}

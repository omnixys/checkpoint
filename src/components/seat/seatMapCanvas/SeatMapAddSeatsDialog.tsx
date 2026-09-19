"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

interface Props {
  open: boolean;
  tableName: string;
  currentCount: number;
  pending: boolean;
  onClose: () => void;
  onConfirm: (count: number) => Promise<void>;
}

export default function SeatMapAddSeatsDialog({
  open,
  tableName,
  currentCount,
  pending,
  onClose,
  onConfirm,
}: Props) {
  const [count, setCount] = React.useState(1);
  React.useEffect(() => {
    if (open) setCount(1);
  }, [open]);
  const valid = Number.isInteger(count) && count > 0 && count <= 1000;
  return (
    <Dialog open={open} onClose={pending ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle>Sitzplätze hinzufügen</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Tisch {tableName} hat aktuell {currentCount} Sitzplätze. Vorhandene Sitzpositionen und
            Zuweisungen bleiben unverändert.
          </Typography>
          <TextField
            autoFocus
            label="Neue Sitzplätze"
            type="number"
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            slotProps={{ htmlInput: { min: 1, max: 1000, step: 1 } }}
            error={!valid}
            helperText={
              valid ? `Danach: ${currentCount + count} Sitzplätze` : "Bitte 1 bis 1.000 eingeben."
            }
            disabled={pending}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={pending}>
          Abbrechen
        </Button>
        <Button
          variant="contained"
          disabled={!valid || pending}
          onClick={() => void onConfirm(count)}
        >
          Hinzufügen
        </Button>
      </DialogActions>
    </Dialog>
  );
}

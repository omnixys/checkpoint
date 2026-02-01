"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type Props = {
  open: boolean;
  sectionName: string;
  onClose: () => void;
  onSave: (input: {
    type: "SECTION";
    from: string;
    to: string;
  }) => Promise<void>;
};

export default function SectionRenameDialog({
  open,
  sectionName,
  onClose,
  onSave,
}: Props) {
  const [value, setValue] = React.useState(sectionName);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setValue(sectionName);
  }, [sectionName]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Section umbenennen</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Diese Änderung betrifft alle Tische und Seats in dieser Section.
          </Typography>

          <TextField label="Aktueller Name" value={sectionName} disabled />

          <TextField
            label="Neuer Name"
            value={value}
            autoFocus
            onChange={(e) => setValue(e.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Abbrechen
        </Button>

        <Button
          variant="contained"
          disabled={!value.trim() || value === sectionName || saving}
          onClick={async () => {
            setSaving(true);
            await onSave({
              type: "SECTION",
              from: sectionName,
              to: value.trim(),
            });
            setSaving(false);
            onClose();
          }}
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}

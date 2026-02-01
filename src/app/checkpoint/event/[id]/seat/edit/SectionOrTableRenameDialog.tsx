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

type Props =
  | {
      open: boolean;
      mode: "SECTION";
      sectionName: string;
      onClose: () => void;
      onSave: (nextName: string) => void;
    }
  | {
      open: boolean;
      mode: "TABLE";
      sectionName: string;
      tableName: string;
      onClose: () => void;
      onSave: (nextName: string) => void;
    };

export default function SectionOrTableRenameDialog(props: Props) {
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (props.mode === "SECTION") {
      setValue(props.sectionName);
    } else {
      setValue(props.tableName);
    }
  }, [props]);

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {props.mode === "SECTION" ? "Section umbenennen" : "Tisch umbenennen"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {props.mode === "SECTION"
              ? "Diese Änderung betrifft alle Tische und Seats in dieser Section."
              : `Section: ${props.sectionName}`}
          </Typography>

          {props.mode === "TABLE" && (
            <TextField
              label="Aktueller Tisch"
              value={props.tableName}
              disabled
            />
          )}

          <TextField
            label="Neuer Name"
            value={value}
            autoFocus
            onChange={(e) => setValue(e.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={props.onClose}>Abbrechen</Button>
        <Button
          variant="contained"
          disabled={!value.trim()}
          onClick={() => {
            props.onSave(value.trim());
            props.onClose();
          }}
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}

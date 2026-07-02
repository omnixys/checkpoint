"use client";

import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import type { SelectedItem } from "./SeatMapEditorToolbar";

interface Props {
  open: boolean;
  selectedItems: SelectedItem[];
  onClose: () => void;
  onRename: (items: { id: string; type: SelectedItem["type"]; newName: string }[]) => void;
}

export default function SeatMapRenameDialog({ open, selectedItems, onClose, onRename }: Props) {
  const [names, setNames] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (!open) return;
    const initial: Record<string, string> = {};
    for (const item of selectedItems) {
      if (item.type === "section") initial[item.id] = item.name;
      else if (item.type === "table") initial[item.id] = item.name;
      else initial[item.id] = item.label;
    }
    setNames(initial);
  }, [open, selectedItems]);

  const handleSave = () => {
    const updates = selectedItems
      .filter((item) => {
        const newName = names[item.id]?.trim();
        if (!newName) return false;
        const oldName = item.type === "section" ? item.name : item.type === "table" ? item.name : item.label;
        return newName !== oldName;
      })
      .map((item) => ({
        id: item.id,
        type: item.type as SelectedItem["type"],
        newName: names[item.id]!.trim(),
      }));
    if (updates.length > 0) {
      onRename(updates);
    }
    onClose();
  };

  const label = (item: SelectedItem): string => {
    if (item.type === "section") return item.name;
    if (item.type === "table") return `Tisch ${item.name}`;
    return `Sitz ${item.label}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {selectedItems.length === 1 ? "Umbenennen" : `${selectedItems.length} Elemente umbenennen`}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          {selectedItems.map((item) => (
            <TextField
              key={item.id}
              label={label(item)}
              fullWidth
              value={names[item.id] ?? ""}
              onChange={(e) => setNames((prev) => ({ ...prev, [item.id]: e.target.value }))}
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button variant="contained" onClick={handleSave}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}

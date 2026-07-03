"use client";

import {
  Add,
  AutoFixHigh,
  ContentCopy,
  DeleteOutlined,
  DriveFileRenameOutline,
  EditOutlined,
  Redo,
  Undo,
  VisibilityOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Stack, Tooltip, Typography } from "@mui/material";

export type EditorMode = "view" | "edit";

export type SelectedItem =
  | { type: "section"; id: string; name: string }
  | { type: "table"; id: string; name: string; sectionId: string }
  | { type: "seat"; id: string; label: string };

interface Props {
  mode: EditorMode;
  onModeToggle: () => void;
  selectedItems: SelectedItem[];
  onAddSection: () => void;
  onAddTable: () => void;
  onDelete: () => void;
  onDuplicateTable: () => void;
  onCloneSection: () => void;
  onAutoGenerate: () => void;
  onRename: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

function selectionLabel(items: SelectedItem[]): string | null {
  if (items.length === 0) {
    return null;
  }
  if (items.length === 1) {
    const s = items[0]!;
    if (s.type === "section") {
      return s.name;
    }
    if (s.type === "table") {
      return `Tisch ${s.name}`;
    }
    return `Sitz ${s.label}`;
  }
  const sections = items.filter(
    (s): s is SelectedItem & { type: "section" } => s.type === "section",
  ).length;
  const tables = items.filter(
    (s): s is SelectedItem & { type: "table" } => s.type === "table",
  ).length;
  const seats = items.filter((s): s is SelectedItem & { type: "seat" } => s.type === "seat").length;
  const parts: string[] = [];
  if (sections) {
    parts.push(`${sections} Bereich${sections > 1 ? "e" : ""}`);
  }
  if (tables) {
    parts.push(`${tables} Tisch${tables > 1 ? "e" : ""}`);
  }
  if (seats) {
    parts.push(`${seats} Sitz${seats > 1 ? "plätze" : ""}`);
  }
  return `${parts.join(", ")} ausgewählt`;
}

export default function SeatMapEditorToolbar({
  mode,
  onModeToggle,
  selectedItems,
  onAddSection,
  onAddTable,
  onDelete,
  onDuplicateTable,
  onCloneSection,
  onAutoGenerate,
  onRename,
  onUndo,
  onRedo,
}: Props) {
  const singleSection = selectedItems.length === 1 && selectedItems[0]?.type === "section";
  const singleTable = selectedItems.length === 1 && selectedItems[0]?.type === "table";
  const label = selectionLabel(selectedItems);

  if (mode === "view") {
    return (
      <Stack
        spacing={1}
        sx={{
          position: "absolute",
          top: 72,
          left: 12,
          zIndex: 60,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          p: 1,
        }}
      >
        <Tooltip title="Bearbeiten">
          <IconButton size="small" onClick={onModeToggle} color="primary">
            <EditOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    );
  }

  return (
    <Stack
      spacing={0.5}
      data-testid="editor-toolbar"
      sx={{
        position: "absolute",
        top: 72,
        left: 12,
        zIndex: 60,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
        p: 1,
        minWidth: 40,
      }}
    >
      <Tooltip title="Ansicht">
        <IconButton size="small" onClick={onModeToggle} color="primary">
          <VisibilityOutlined fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider />

      <Tooltip title="Rückgängig">
        <IconButton size="small" onClick={onUndo}>
          <Undo fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Wiederholen">
        <IconButton size="small" onClick={onRedo}>
          <Redo fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider />

      <Tooltip title="Bereich hinzufügen">
        <IconButton size="small" onClick={onAddSection}>
          <Add fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Tisch hinzufügen">
        <IconButton size="small" onClick={onAddTable}>
          <Add fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider />

      {singleSection && (
        <Tooltip title="Bereich duplizieren">
          <IconButton size="small" onClick={onCloneSection}>
            <ContentCopy fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {singleTable && (
        <Tooltip title="Tisch duplizieren">
          <IconButton size="small" onClick={onDuplicateTable}>
            <ContentCopy fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {selectedItems.length > 0 && (
        <Tooltip title="Umbenennen">
          <IconButton size="small" onClick={onRename}>
            <DriveFileRenameOutline fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {selectedItems.length > 0 && (
        <Tooltip title="Löschen">
          <IconButton size="small" onClick={onDelete} color="error">
            <DeleteOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      <Divider />

      <Tooltip title="Auto-Generieren">
        <IconButton size="small" onClick={onAutoGenerate}>
          <AutoFixHigh fontSize="small" />
        </IconButton>
      </Tooltip>

      {label && (
        <Box sx={{ px: 0.5, pt: 0.5 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 9 }}>
            {label}
          </Typography>
        </Box>
      )}
    </Stack>
  );
}

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
import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

export type EditorMode = "view" | "edit";

export type SelectedItem =
  | { type: "section"; id: string; name: string }
  | { type: "table"; id: string; name: string; sectionId: string }
  | { type: "seat"; id: string; label: string };

type SingleKind = SelectedItem["type"];

const SHAPE_OPTIONS: Record<SingleKind, { value: string; label: string }[]> = {
  section: [
    { value: "RECTANGLE", label: "Rechteckig" },
    { value: "CIRCLE", label: "Rund" },
  ],
  table: [
    { value: "ROUND", label: "Rund" },
    { value: "RECTANGLE", label: "Rechteckig" },
    { value: "OVAL", label: "Oval" },
    { value: "ROW", label: "Reihen" },
  ],
  seat: [
    { value: "CIRCLE", label: "Rund" },
    { value: "SQUARE", label: "Quadrat" },
    { value: "RECTANGLE", label: "Bank" },
  ],
};

const SHAPE_DEFAULT: Record<SingleKind, string> = {
  section: "RECTANGLE",
  table: "ROUND",
  seat: "CIRCLE",
};

interface Props {
  disabled?: boolean;
  importDisabled?: boolean;
  mode: EditorMode;
  onModeToggle: () => void;
  selectedItems: SelectedItem[];
  onAddSection: () => void;
  onAddTable: () => void;
  onAddSeats: () => void;
  onDelete: () => void;
  onDuplicateTable: () => void;
  onCloneSection: () => void;
  onAutoGenerate: () => void;
  onRename: () => void;
  onUndo: () => void;
  onRedo: () => void;
  selectedShape?: string | null;
  onSetShape?: (shape: string) => void;
  onMakeTableSquare?: () => void;
  geometryDisabled?: boolean;
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
  disabled = false,
  importDisabled = false,
  mode,
  onModeToggle,
  selectedItems,
  onAddSection,
  onAddTable,
  onAddSeats,
  onDelete,
  onDuplicateTable,
  onCloneSection,
  onAutoGenerate,
  onRename,
  onUndo,
  onRedo,
  selectedShape = null,
  onSetShape,
  onMakeTableSquare,
  geometryDisabled = false,
}: Props) {
  const singleSection = selectedItems.length === 1 && selectedItems[0]?.type === "section";
  const singleTable = selectedItems.length === 1 && selectedItems[0]?.type === "table";
  const single = selectedItems.length === 1 ? selectedItems[0] : null;
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
          <IconButton size="small" aria-label="Edit" onClick={onModeToggle} color="primary">
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
        minWidth: single ? 136 : 40,
      }}
    >
      <Tooltip title="Ansicht">
        <IconButton size="small" aria-label="View" onClick={onModeToggle} color="primary">
          <VisibilityOutlined fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider />

      <Tooltip title="Rückgängig">
        <IconButton disabled={disabled} size="small" aria-label="Undo" onClick={onUndo}>
          <Undo fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Wiederholen">
        <IconButton disabled={disabled} size="small" aria-label="Redo" onClick={onRedo}>
          <Redo fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider />

      <Tooltip title="Bereich hinzufügen">
        <IconButton
          disabled={disabled}
          size="small"
          aria-label="Add section"
          onClick={onAddSection}
        >
          <Add fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Tisch hinzufügen">
        <IconButton
          disabled={disabled || !singleSection}
          size="small"
          aria-label="Add table"
          onClick={onAddTable}
        >
          <Add fontSize="small" />
        </IconButton>
      </Tooltip>

      {singleTable && (
        <Tooltip title="Sitzplätze hinzufügen">
          <IconButton disabled={disabled} size="small" aria-label="Add seats" onClick={onAddSeats}>
            <Add fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      <Divider />

      {singleSection && (
        <Tooltip title="Bereich duplizieren">
          <IconButton
            disabled={disabled}
            size="small"
            aria-label="Clone section"
            onClick={onCloneSection}
          >
            <ContentCopy fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {singleTable && (
        <Tooltip title="Tisch duplizieren">
          <IconButton
            disabled={disabled}
            size="small"
            aria-label="Duplicate table"
            onClick={onDuplicateTable}
          >
            <ContentCopy fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {selectedItems.length > 0 && (
        <Tooltip title="Umbenennen">
          <IconButton disabled={disabled} size="small" aria-label="Rename" onClick={onRename}>
            <DriveFileRenameOutline fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {selectedItems.length > 0 && (
        <Tooltip title="Löschen">
          <IconButton
            disabled={disabled}
            size="small"
            aria-label="Delete"
            onClick={onDelete}
            color="error"
          >
            <DeleteOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      <Divider />

      {single && onSetShape && (
        <Stack spacing={0.5} sx={{ px: 0.5, pt: 0.25, minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 9 }}>
            Form
          </Typography>
          <Select
            size="small"
            fullWidth
            value={selectedShape ?? SHAPE_DEFAULT[single.type]}
            disabled={geometryDisabled}
            onChange={(e) => onSetShape(String(e.target.value))}
          >
            {SHAPE_OPTIONS[single.type].map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
          {singleTable && onMakeTableSquare && (
            <Button
              size="small"
              variant="outlined"
              disabled={geometryDisabled}
              onClick={onMakeTableSquare}
            >
              Quadrat
            </Button>
          )}
        </Stack>
      )}

      <Divider />

      <Tooltip title="Sitzplan erstellen">
        <IconButton
          disabled={importDisabled}
          size="small"
          aria-label="Create layout"
          onClick={onAutoGenerate}
        >
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

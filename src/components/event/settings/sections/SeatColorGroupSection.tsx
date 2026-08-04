"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveIcon from "@mui/icons-material/Save";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

import { SeatColorGroupMatchType } from "@/checkpoint/generated/graphql";
import { glassInputSx } from "@/checkpoint/themes/styles/glassInput";

interface StyleInput {
  background: string;
  foreground: string;
  border: string;
  legendIcon: string;
}

interface StylePayload {
  __typename?: string;
  background: string | null;
  foreground: string | null;
  border: string | null;
  legendIcon: string | null;
}

interface GroupPayload {
  __typename?: string;
  id: string;
  name: string;
  matchType: SeatColorGroupMatchType;
  invitedByValues: string[] | null;
  priority: number;
  order: number;
  isOrphaned: boolean;
  style: StylePayload | null;
}

type ColorGroup = GroupPayload;

const DEFAULT_STYLE: StyleInput = {
  background: "#E53935",
  foreground: "#FFFFFF",
  border: "#C62828",
  legendIcon: "#E53935",
};

const STYLE_PRESETS: { name: string; style: StyleInput }[] = [
  { name: "Red", style: DEFAULT_STYLE },
  {
    name: "Blue",
    style: {
      background: "#1E88E5",
      foreground: "#FFFFFF",
      border: "#1565C0",
      legendIcon: "#1E88E5",
    },
  },
  {
    name: "Green",
    style: {
      background: "#43A047",
      foreground: "#FFFFFF",
      border: "#2E7D32",
      legendIcon: "#43A047",
    },
  },
  {
    name: "Orange",
    style: {
      background: "#FB8C00",
      foreground: "#FFFFFF",
      border: "#EF6C00",
      legendIcon: "#FB8C00",
    },
  },
  {
    name: "Purple",
    style: {
      background: "#8E24AA",
      foreground: "#FFFFFF",
      border: "#6A1B9A",
      legendIcon: "#8E24AA",
    },
  },
  {
    name: "Teal",
    style: {
      background: "#00897B",
      foreground: "#FFFFFF",
      border: "#00695C",
      legendIcon: "#00897B",
    },
  },
  {
    name: "Pink",
    style: {
      background: "#D81B60",
      foreground: "#FFFFFF",
      border: "#C2185B",
      legendIcon: "#D81B60",
    },
  },
  {
    name: "Indigo",
    style: {
      background: "#3949AB",
      foreground: "#FFFFFF",
      border: "#283593",
      legendIcon: "#3949AB",
    },
  },
  {
    name: "Amber",
    style: {
      background: "#FFB300",
      foreground: "#1A1A1A",
      border: "#FF8F00",
      legendIcon: "#FFB300",
    },
  },
  {
    name: "Cyan",
    style: {
      background: "#00ACC1",
      foreground: "#FFFFFF",
      border: "#00838F",
      legendIcon: "#00ACC1",
    },
  },
];

function getLegendColor(style: StylePayload | StyleInput | null): string {
  if (!style) {
    return DEFAULT_STYLE.legendIcon;
  }

  return style.legendIcon?.startsWith("#")
    ? style.legendIcon
    : (style.background ?? DEFAULT_STYLE.legendIcon);
}

function sanitizeInvitedByValues(values: string[], invitedByOptions: string[]): string[] {
  const allowed = new Set(invitedByOptions);
  return values.filter((value, index, arr) => allowed.has(value) && arr.indexOf(value) === index);
}

interface Props {
  settings: { seatColorGroups?: GroupPayload[] | null; invitedByOptions?: string[] | null };
  actions: {
    updateSettings: (patch: any) => Promise<any>;
  };
}

function ColorGroupBox({ group }: { group: ColorGroup }) {
  const theme = useTheme();
  const s = group.style;

  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        alignItems: "center",
        p: 1.5,
        borderRadius: 2,
        border: `1px solid ${s?.border ?? theme.palette.divider}`,
        backgroundColor: s?.background ?? "transparent",
      }}
    >
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          backgroundColor: getLegendColor(s),
          border: `3px solid ${s?.border ?? "transparent"}`,
          flexShrink: 0,
        }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, color: s?.foreground ?? "inherit" }}>
          {group.name}
        </Typography>
        <Typography variant="caption" sx={{ color: s?.foreground ?? "inherit", opacity: 0.8 }}>
          {group.matchType}
          {group.invitedByValues && group.invitedByValues.length > 0
            ? `: ${group.invitedByValues.join(", ")}`
            : ""}
          {group.isOrphaned ? " (orphaned)" : ""}
        </Typography>
      </Box>
      <Chip label={`p${group.priority}`} size="small" variant="outlined" />
    </Stack>
  );
}

export default function SeatColorGroupSection({ settings, actions }: Props) {
  const theme = useTheme();
  const groups = settings.seatColorGroups ?? [];
  const invitedByOptions = settings.invitedByOptions ?? [];

  const [localGroups, setLocalGroups] = useState<ColorGroup[]>(groups);
  const [dirty, setDirty] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editMatchType, setEditMatchType] = useState<SeatColorGroupMatchType>(
    SeatColorGroupMatchType.SINGLE,
  );
  const [editValues, setEditValues] = useState<string[]>([]);
  const [editBg, setEditBg] = useState("");
  const [editFg, setEditFg] = useState("");
  const [editBorder, setEditBorder] = useState("");
  const [editLegendColor, setEditLegendColor] = useState("");

  useEffect(() => {
    setLocalGroups(groups);
    setDirty(false);
  }, [groups]);

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setEditName("");
    setEditMatchType(SeatColorGroupMatchType.SINGLE);
    setEditValues([]);
    setEditBg(DEFAULT_STYLE.background);
    setEditFg(DEFAULT_STYLE.foreground);
    setEditBorder(DEFAULT_STYLE.border);
    setEditLegendColor(DEFAULT_STYLE.legendIcon);
    setDialogOpen(true);
  };

  const handleOpenEdit = (idx: number) => {
    const g = localGroups[idx];
    if (!g) {
      return;
    }
    const s = g.style ?? { background: "", foreground: "", border: "", legendIcon: "" };
    setEditingIndex(idx);
    setEditName(g.name);
    setEditMatchType(g.matchType ?? SeatColorGroupMatchType.SINGLE);
    setEditValues(sanitizeInvitedByValues(g.invitedByValues ?? [], invitedByOptions));
    setEditBg(s.background ?? "");
    setEditFg(s.foreground ?? "");
    setEditBorder(s.border ?? "");
    setEditLegendColor(getLegendColor(s));
    setDialogOpen(true);
  };

  const applyPreset = (presetName: string) => {
    const preset = STYLE_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setEditBg(preset.style.background);
      setEditFg(preset.style.foreground);
      setEditBorder(preset.style.border);
      setEditLegendColor(preset.style.legendIcon);
    }
  };

  const handleSaveDialog = () => {
    const existingGroup = editingIndex !== null ? localGroups[editingIndex] : undefined;
    const style: StyleInput = {
      background: editBg || DEFAULT_STYLE.background,
      foreground: editFg || DEFAULT_STYLE.foreground,
      border: editBorder || DEFAULT_STYLE.border,
      legendIcon: editLegendColor || editBg || DEFAULT_STYLE.legendIcon,
    };
    const invitedByValues = sanitizeInvitedByValues(editValues, invitedByOptions);

    const newGroup: ColorGroup = {
      id: existingGroup?.id ?? "",
      name: editName,
      matchType: editMatchType,
      invitedByValues: editMatchType !== SeatColorGroupMatchType.NONE ? invitedByValues : [],
      priority: existingGroup?.priority ?? localGroups.length + 1,
      order: existingGroup?.order ?? localGroups.length,
      isOrphaned: false,
      style,
    };

    const next = [...localGroups];
    if (editingIndex !== null) {
      next[editingIndex] = newGroup;
    } else {
      next.push(newGroup);
    }
    setLocalGroups(next);
    setDirty(true);
    setDialogOpen(false);
  };

  const handleDelete = (idx: number) => {
    setLocalGroups((prev) => prev.filter((_, i) => i !== idx));
    setDirty(true);
  };

  const handleSave = async () => {
    setDirty(false);
    await actions.updateSettings({
      seatColorGroups: localGroups.map((g, idx) => ({
        id: g.id || undefined,
        name: g.name,
        matchType: g.matchType,
        invitedByValues: g.invitedByValues ?? [],
        priority: g.priority,
        order: idx,
        isOrphaned: g.isOrphaned,
        style: g.style,
      })),
    });
  };

  const panelSx = {
    p: 2.5,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 2,
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.72)",
    boxShadow: theme.palette.mode === "dark" ? "none" : "0 10px 30px rgba(15,23,42,0.06)",
  };

  const inputSx = glassInputSx(theme);

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between" }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Seat Colors
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Define color groups that are matched to guests based on their RSVP source.
          </Typography>
        </Box>
      </Stack>

      <Box sx={panelSx}>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Color Groups ({localGroups.length})
            </Typography>
            <Button
              onClick={handleOpenAdd}
              startIcon={<AddRoundedIcon />}
              size="small"
              variant="outlined"
            >
              Add Group
            </Button>
          </Stack>

          {localGroups.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No color groups defined yet. Default groups will be created automatically when you
              save with invitedByOptions set.
            </Typography>
          )}

          <Stack spacing={1}>
            {localGroups.map((group, idx) => (
              <Stack
                key={group.id || idx}
                direction="row"
                spacing={1}
                sx={{ alignItems: "center" }}
              >
                <Box sx={{ flex: 1 }}>
                  <ColorGroupBox group={group} />
                </Box>
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => handleOpenEdit(idx)}>
                    <EditRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={() => handleDelete(idx)}>
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button disabled={!dirty} onClick={handleSave} startIcon={<SaveIcon />} variant="contained">
          Save Seat Colors
        </Button>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingIndex !== null ? "Edit Group" : "Add Group"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              label="Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              sx={inputSx}
            />

            <TextField
              select
              label="Match Type"
              value={editMatchType}
              onChange={(e) => setEditMatchType(e.target.value as SeatColorGroupMatchType)}
              fullWidth
              sx={inputSx}
            >
              <MenuItem value={SeatColorGroupMatchType.NONE}>
                NONE - No invitedBy selection
              </MenuItem>
              <MenuItem value={SeatColorGroupMatchType.SINGLE}>
                SINGLE - First selected value matches
              </MenuItem>
              <MenuItem value={SeatColorGroupMatchType.CUSTOM}>
                CUSTOM - All guest values must be in this group
              </MenuItem>
              <MenuItem value={SeatColorGroupMatchType.ALL}>
                ALL - All values selected (catch-all)
              </MenuItem>
            </TextField>

            {editMatchType !== SeatColorGroupMatchType.NONE && (
              <Autocomplete
                multiple
                options={invitedByOptions}
                value={editValues}
                onChange={(_, newVal) =>
                  setEditValues(sanitizeInvitedByValues(newVal, invitedByOptions))
                }
                disableCloseOnSelect
                freeSolo={false}
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, option, { selected }) => {
                  const { key, ...optionProps } = props;
                  return (
                    <Box component="li" key={key} {...optionProps}>
                      <Checkbox checked={selected} size="small" sx={{ mr: 1 }} />
                      {option}
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Invited By Values"
                    placeholder="Select values"
                    sx={inputSx}
                  />
                )}
                renderValue={(value, getItemProps) =>
                  (Array.isArray(value) ? value : [value]).map((option, index) => {
                    const itemProps = getItemProps({ index });
                    return (
                      <Chip
                        key={itemProps.key}
                        label={option}
                        size="small"
                        onDelete={itemProps.onDelete}
                        className={itemProps.className}
                      />
                    );
                  })
                }
              />
            )}

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1 }}>
              Colors
            </Typography>

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {STYLE_PRESETS.map((p) => (
                <Tooltip key={p.name} title={p.name}>
                  <Box
                    onClick={() => applyPreset(p.name)}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: p.style.background,
                      border: `2px solid ${p.style.border}`,
                      cursor: "pointer",
                      "&:hover": { opacity: 0.8 },
                      flexShrink: 0,
                    }}
                  />
                </Tooltip>
              ))}
            </Stack>

            <Stack spacing={2}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <TextField
                  label="Background"
                  type="color"
                  value={editBg}
                  onChange={(e) => setEditBg(e.target.value)}
                  sx={{ flex: 1, "& input": { cursor: "pointer", height: 40 } }}
                />
                <TextField
                  label="Foreground"
                  type="color"
                  value={editFg}
                  onChange={(e) => setEditFg(e.target.value)}
                  sx={{ flex: 1, "& input": { cursor: "pointer", height: 40 } }}
                />
                <TextField
                  label="Border"
                  type="color"
                  value={editBorder}
                  onChange={(e) => setEditBorder(e.target.value)}
                  sx={{ flex: 1, "& input": { cursor: "pointer", height: 40 } }}
                />
                <TextField
                  label="Legend"
                  type="color"
                  value={editLegendColor}
                  onChange={(e) => setEditLegendColor(e.target.value)}
                  sx={{ flex: 1, "& input": { cursor: "pointer", height: 40 } }}
                />
              </Stack>
            </Stack>

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: editBg,
                border: `2px solid ${editBorder}`,
                color: editFg,
                textAlign: "center",
                fontWeight: 700,
              }}
            >
              {editName || "Preview"}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button disabled={!editName.trim()} onClick={handleSaveDialog} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

"use client";

import { RenameConflict } from "@/checkpoint/types/seat.type";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

type Props = {
  open: boolean;
  conflicts: RenameConflict[];
  onClose: () => void;
};

export function useRenameConflicts(conflicts: RenameConflict[] | null) {
  const sectionNames = new Set<string>();
  const tableNames = new Set<string>();

  conflicts?.forEach((c) => {
    if (c.type === "SECTION") sectionNames.add(c.name);
    if (c.type === "TABLE") tableNames.add(c.name);
  });

  return {
    hasSectionConflict: (name: string) => sectionNames.has(name),
    hasTableConflict: (name: string) => tableNames.has(name),
  };
}

export default function SeatRenameConflictDialog({ open, conflicts, onClose }: Props) {
  const sections = conflicts.filter((c) => c.type === "SECTION");
  const tables = conflicts.filter((c) => c.type === "TABLE");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <WarningAmberRoundedIcon color="warning" />
        Namenskonflikte erkannt
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Einige Namen existieren bereits und konnten nicht übernommen werden.
            Bitte passe diese Einträge an.
          </Typography>

          {sections.length > 0 && (
            <Box>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: 12,
                  alignItems: "center",
                }}
              >
                Sections
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  flexWrap: "wrap",
                }}
              >
                {sections.map((c) => (
                  <Chip
                    key={c.id}
                    color="error"
                    variant="outlined"
                    label={c.name}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {tables.length > 0 && (
            <Box>
              <Typography
                variant="subtitle2"
             
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: 12,
                  alignItems: "center",
                }}
              >
                Tische
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  flexWrap: "wrap",
                }}
              >
                {tables.map((c) => (
                  <Chip
                    key={c.id}
                    color="error"
                    variant="outlined"
                    label={c.name}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Verstanden
        </Button>
      </DialogActions>
    </Dialog>
  );
}

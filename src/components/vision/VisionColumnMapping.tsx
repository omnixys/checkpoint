// path: src/checkpoint/components/invitation/VisionColumnMapping.tsx

"use client";

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  Typography,
  Button,
} from "@mui/material";

type Props = {
  open: boolean;
  headers: string[];
  mapping: Record<string, string>;
  onChange: (mapping: Record<string, string>) => void;
  onClose: () => void;
};

const TARGET_FIELDS = [
  "firstName",
  "lastName",
  "phone",
  "email",
  "maxPlusOnes",
];

export default function VisionColumnMapping({
  open,
  headers,
  mapping,
  onChange,
  onClose,
}: Props) {
  function update(header: string, value: string) {
    onChange({
      ...mapping,
      [header]: value,
    });
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Spalten Mapping</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          {headers.map((h) => (
            <Box key={h}>
              <Typography variant="caption">{h}</Typography>

              <Select
                fullWidth
                value={mapping[h] || ""}
                onChange={(e) => update(h, e.target.value)}
              >
                {TARGET_FIELDS.map((f) => (
                  <MenuItem key={f} value={f}>
                    {f}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          ))}

          <Button variant="contained" onClick={onClose}>
            Übernehmen
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

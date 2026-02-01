"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";

const REQUIRED = ["firstName", "lastName", "phone"];

export function VisionOSColumnMapping({
  open,
  onClose,
  headers,
  onFinish,
}: {
  open: boolean;
  onClose: () => void;
  headers: string[];
  onFinish: (mapping: Record<string, string>) => void;
}) {
  const defaultMapping: Record<string, string> = {};
  REQUIRED.forEach(
    (k) =>
      (defaultMapping[k] =
        headers.find((h) => h.toLowerCase().includes(k.toLowerCase())) ?? "")
  );

  const [mapping, setMapping] = useState(defaultMapping);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <DialogTitle>Spalten zuordnen</DialogTitle>

        <DialogContent>
          <Stack spacing={3}>
            {REQUIRED.map((req) => (
              <Stack key={req}>
                <Typography fontWeight={600}>{req}</Typography>
                <Select
                  value={mapping[req]}
                  onChange={(e) =>
                    setMapping({ ...mapping, [req]: e.target.value })
                  }
                  sx={{
                    borderRadius: 3,
                    backdropFilter: "blur(30px)",
                    background: "rgba(255,255,255,0.5)",
                  }}
                >
                  {headers.map((h) => (
                    <MenuItem key={h} value={h}>
                      {h}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            ))}

            <Button
              variant="contained"
              sx={{ borderRadius: 3, mt: 2 }}
              onClick={() => onFinish(mapping)}
            >
              Weiter
            </Button>
          </Stack>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}

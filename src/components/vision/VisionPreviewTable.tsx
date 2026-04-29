// path: src/checkpoint/components/invitation/VisionPreviewTable.tsx

"use client";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  alpha,
  useTheme,
  TextField,
  Chip,
} from "@mui/material";
import { useState } from "react";

/* ---------------------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------------------- */
type Row = Record<string, unknown>;

type Props = {
  rows: Row[];
  duplicates: number[];
  errors: string[];
  onChange?: (rows: Row[]) => void;
};

/* ---------------------------------------------------------------------------
 * VALIDATION
 * ------------------------------------------------------------------------- */
const REQUIRED_FIELDS = ["firstName", "lastName"];

/* ---------------------------------------------------------------------------
 * AUTO FIX
 * ------------------------------------------------------------------------- */
function autoFixValue(key: string, value: string): string {
  let v = value.trim();

  if (key === "phone") {
    // remove spaces + normalize
    v = v.replace(/\s+/g, "");

    if (!v.startsWith("0") && !v.startsWith("+")) {
      v = "0" + v;
    }
  }

  if (key === "maxPlusOnes") {
    const num = Number(v);
    if (!isNaN(num)) {
      return String(Math.max(0, num));
    }
  }

  return v;
}

/* ---------------------------------------------------------------------------
 * COMPONENT
 * ------------------------------------------------------------------------- */
export default function VisionPreviewTable({ rows, duplicates, errors, onChange }: Props) {
  const theme = useTheme();

  const [localRows, setLocalRows] = useState<Row[]>(rows);

  if (!rows.length) return null;

  const headers = Object.keys(rows[0] ?? {});

  /* -----------------------------------------------------------------------
   * VALIDATION CHECK
   * --------------------------------------------------------------------- */
  function isCellInvalid(row: Row, key: string): boolean {
    if (!REQUIRED_FIELDS.includes(key)) return false;

    return !String(row[key] ?? "").trim();
  }

  /* -----------------------------------------------------------------------
   * UPDATE CELL
   * --------------------------------------------------------------------- */
  function updateCell(rowIndex: number, key: string, value: string) {
    const fixed = autoFixValue(key, value);

    const clone = [...localRows];
    clone[rowIndex] = {
      ...clone[rowIndex],
      [key]: fixed,
    };

    setLocalRows(clone);
    onChange?.(clone);
  }

  /* -----------------------------------------------------------------------
   * STYLES
   * --------------------------------------------------------------------- */
  const glassBg = alpha(theme.palette.background.paper, 0.55);
  const border = alpha(theme.palette.divider, 0.2);

  return (
    <Box
      sx={{
        mt: 2,
        borderRadius: "28px",
        overflow: "hidden",
        backdropFilter: "blur(30px)",
        background: glassBg,
        border: `1px solid ${border}`,
        boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.15)}`,
      }}
    >
      <Table size="small">
        {/* ---------------- HEAD ---------------- */}
        <TableHead>
          <TableRow>
            {headers.map((h) => (
              <TableCell
                key={h}
                sx={{
                  fontWeight: 700,
                  fontSize: theme.typography.pxToRem(12),
                  color: "text.secondary",
                  borderBottom: `1px solid ${border}`,
                }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* ---------------- BODY ---------------- */}
        <TableBody>
          {localRows.slice(0, 20).map((row, rowIndex) => {
            const isDuplicate = duplicates.includes(rowIndex);

            return (
              <TableRow
                key={rowIndex}
                sx={{
                  background: isDuplicate ? alpha(theme.palette.warning.main, 0.12) : "transparent",

                  "&:hover": {
                    background: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                {headers.map((key) => {
                  const value = String(row[key] ?? "");
                  const invalid = isCellInvalid(row, key);

                  return (
                    <TableCell
                      key={key}
                      sx={{
                        p: 0,
                        borderBottom: `1px solid ${alpha(border, 0.6)}`,
                      }}
                    >
                      <TextField
                        value={value}
                        onChange={(e) => updateCell(rowIndex, key, e.target.value)}
                        variant="standard"
                        fullWidth
                        size="small"
                        error={invalid}
                        slotProps={{
                          input: {
                            disableUnderline: true,
                          },
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            px: 2,
                            py: 1.2,
                            fontSize: theme.typography.pxToRem(14),
                            borderRadius: "12px",
                            transition: "all 0.2s ease",

                            ...(invalid && {
                              background: alpha(theme.palette.error.main, 0.12),
                              boxShadow: `0 0 0 1px ${alpha(theme.palette.error.main, 0.4)}`,
                            }),

                            "&:hover": {
                              background: alpha(theme.palette.primary.main, 0.08),
                            },

                            "&.Mui-focused": {
                              background: alpha(theme.palette.primary.main, 0.12),
                            },
                          },
                        }}
                      />
                    </TableCell>
                  );
                })}

                {/* STATUS BADGE */}
                <TableCell>
                  {isDuplicate && <Chip size="small" color="warning" label="Duplicate" />}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* ---------------- FOOTER ---------------- */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${border}`,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          Vorschau zeigt erste 20 Einträge
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {errors.length > 0 && (
            <Typography variant="caption" color="error.main">
              ⚠ {errors.length} Fehler
            </Typography>
          )}

          {duplicates.length > 0 && (
            <Typography variant="caption" color="warning.main">
              ⚠ {duplicates.length} Duplikate
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

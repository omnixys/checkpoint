"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { getLogger } from "@/components/../utils/logger";
import DialogTransition from "@/components/invitationList/DialogTransition";
import { UseInvitationLogicReturn } from "@/components/invitationList/hooks/useInvitationLogic";
import VisionDropzone from "@/components/invitationList/vision/VisionDropzone";
import { VisionOSColumnMapping } from "@/components/invitationList/vision/VisionOSColumnMapping";
import { VisionOSInfoSheet } from "@/components/invitationList/vision/VisionOSInfoSheet";
import { VisionOSInlineFix } from "@/components/invitationList/vision/VisionOSInlineFix";
import { VisionOSProgress } from "@/components/invitationList/vision/VisionOSProgress";
import { VisionOSSuccessSheet } from "@/components/invitationList/vision/VisionOSSuccessSheet";
import ExcelJS from "exceljs";
import Papa from "papaparse";

/* ---------------------------------------------------------------------------
 * Column auto-correct dictionary
 * ------------------------------------------------------------------------- */
const COLUMN_ALIASES: Record<string, string> = {
  "first name": "firstName",
  firstname: "firstName",
  vorname: "firstName",

  "last name": "lastName",
  lastname: "lastName",
  nachname: "lastName",

  mobil: "phone",
  telefon: "phone",
  phone: "phone",
  phonenumber: "phone",
  "phone number": "phone",

  "plus ones": "maxPlusOnes",
  "max plus ones": "maxPlusOnes",
  maxplusones: "maxPlusOnes",
  maxinvitees: "maxPlusOnes",
};

function normalizeColumn(col: string): string {
  const clean = col.trim().toLowerCase();
  return COLUMN_ALIASES[clean] || col;
}

/* ---------------------------------------------------------------------------
 * Duplicate Detection
 * ------------------------------------------------------------------------- */
function detectDuplicates(rows: any[], existing: any[]) {
  const duplicates: number[] = [];

  rows.forEach((r, idx) => {
    const exists = existing.some(
      (inv) =>
        inv.firstName?.toLowerCase().trim() ===
          r.firstName?.toLowerCase().trim() &&
        inv.lastName?.toLowerCase().trim() === r.lastName?.toLowerCase().trim(),
    );

    if (exists) duplicates.push(idx);
  });

  return duplicates;
}

/* ---------------------------------------------------------------------------
 * COMPONENT
 * ------------------------------------------------------------------------- */
export default function InvitationImportDialog({
  logic,
}: {
  logic: UseInvitationLogicReturn;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [duplicateIdx, setDuplicateIdx] = useState<number[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  // VisionOS Additions
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mappingOpen, setMappingOpen] = useState(false);
  const [inlineFixRow, setInlineFixRow] = useState<number | null>(null);
  const [showDuplicateInfo, setShowDuplicateInfo] = useState(false);
  const [importCount, setImportCount] = useState(0);

  const existing = logic.invitations ?? [];

  /* ======================================================================
   * handleFile()
   * Upload → parse → detect duplicates → show preview
   * ====================================================================== */
  async function handleFile(f: File | null) {
    const logger = getLogger("handleFile");
    setFile(f);
    setRows([]);
    setErrors([]);
    setDuplicateIdx([]);
    setPreviewOpen(false);

    if (!f) return;

    //
    // 1) Upload to backend → returns uploadId + type
    //
    const form = new FormData();
    form.append("file", f);

    const uploadLink =
      process.env.NEXT_PUBLIC_UPLOAD_URI ||
      "http://localhost:7407/upload/invitation";
    const uploadRes = await fetch(uploadLink, {
      method: "POST",
      body: form,
    });

    const uploadJson = await uploadRes.json();
    logic.setUploadId(uploadJson.uploadId);
    logic.setUploadType(uploadJson.type);

    //
    // 2) Parse locally
    //
    const isCsv = f.name.toLowerCase().endsWith(".csv");
    const isExcel = f.name.toLowerCase().endsWith(".xlsx");

    let parsedRows: any[] = [];

    /* ---------- CSV ---------- */
    if (isCsv) {
      const text = await f.text();
      const parsed = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
      });
      parsedRows = parsed.data as any[];
    }

    /* ---------- EXCEL ---------- */
    if (isExcel) {
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(await f.arrayBuffer());
      const sheet = wb.worksheets[0];
      if (!sheet) return;

      const rawHeaders = sheet.getRow(1).values as string[];
      const headers = rawHeaders.map((h) =>
        typeof h === "string" ? normalizeColumn(h) : h,
      );

      parsedRows = [];
      sheet.eachRow((row, idx) => {
        if (idx === 1) return;
        const values = Array.isArray(row.values) ? row.values : [];
        const obj: any = {};
        values.forEach((val, colIndex) => {
          const key = headers[colIndex];
          if (typeof key === "string") obj[key] = val;
        });
        parsedRows.push(obj);
      });
    }

    //
    // 3) Auto-column correction for CSV
    //
    parsedRows = parsedRows.map((r) => {
      const newObj: any = {};
      Object.keys(r).forEach((k) => {
        newObj[normalizeColumn(k)] = r[k];
      });
      return newObj;
    });

    //
    // 4) Validation
    //
    const required = ["firstName", "lastName", "phone"];
    const validationErr: string[] = [];

    parsedRows.forEach((r, idx) => {
      required.forEach((key) => {
        if (!r[key]?.toString().trim()) {
          validationErr.push(`Zeile ${idx + 2}: Feld "${key}" fehlt`);
        }
      });
    });

    //
    // 5) Duplicate detection
    //
    const duplicates = detectDuplicates(parsedRows, existing);
    setDuplicateIdx(duplicates);

    if (duplicates.length > 0) {
      setShowDuplicateInfo(true);
    }

    setErrors(validationErr);
    setRows(parsedRows);
    setPreviewOpen(true);

    logger.debug("EXISTING:", existing);
    logger.debug("ROWS:", parsedRows);

    //
    // 6) Auto open mapping if headers missing
    //
    const missingRequired = required.filter(
      (req) => !Object.keys(parsedRows[0] || {}).includes(req),
    );
    if (missingRequired.length > 0) {
      setMappingOpen(true);
    }
  }

  /* ======================================================================
   * submit()
   * ====================================================================== */
  async function submit() {
    if (!file) return;

    setProgress(10);
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 8, 92));
    }, 180);

    const result = await logic.importInvitations({
      variables: {
        input: {
          eventId: logic.eventId,
          uploadId: logic.uploadId,
          uploadType: logic.uploadType,
        },
      },
    });

    clearInterval(interval);
    setProgress(100);

    // Success Reaction
    setTimeout(() => {
      setShowSuccess(true);
      logic.refetch();

      // Dialog auto-close
      logic.setImportOpen(false);
      setImportCount(rows.length); // <- wichtig, bevor du rows leerst

      // Reset states
      setFile(null);
      setRows([]);
      setErrors([]);
      setDuplicateIdx([]);
      setPreviewOpen(false);
      setProgress(0);
      setMappingOpen(false);
      setInlineFixRow(null);
    }, 350);
  }

  /* ======================================================================
   * Render
   * ====================================================================== */
  return (
    <>
      {/* MAIN DIALOG */}
      <Dialog
        open={logic.importOpen}
        onClose={() => logic.setImportOpen(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={DialogTransition}
      >
        <DialogTitle>Bulk Import – VisionOS</DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <VisionDropzone file={file} onSelect={handleFile} />

            {/* --- Preview Table --- */}
            {previewOpen && rows.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  Vorschau ({rows.length} Einträge)
                </Typography>

                <Box sx={{ position: "relative" }}>
                  <Table
                    size="small"
                    sx={{
                      background: "rgba(255,255,255,0.4)",
                      backdropFilter: "blur(20px)",
                      borderRadius: 3,
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        {Object.keys(rows[0]).map((h) => (
                          <TableCell key={h} sx={{ fontWeight: 600 }}>
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {rows.slice(0, 10).map((r, i) => (
                        <TableRow key={i}>
                          {Object.keys(r).map((k) => (
                            <TableCell key={k}>{r[k]}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </>
            )}
          </Stack>
        </DialogContent>

        {/* DIALOG ACTIONS */}
        <DialogActions sx={{ pb: 2, pr: 3 }}>
          <Button onClick={() => logic.setImportOpen(false)}>Abbrechen</Button>

          <Button
            variant="contained"
            disabled={rows.length === 0}
            onClick={submit}
          >
            Importieren
          </Button>
        </DialogActions>
      </Dialog>

      {/* VisionOS Progress */}
      {progress > 0 && progress < 100 && (
        <VisionOSProgress progress={progress} />
      )}

      {/* Success Sheet */}
      <VisionOSSuccessSheet
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        count={importCount}
      />

      {/* Column Mapping */}
      <VisionOSColumnMapping
        open={mappingOpen}
        onClose={() => setMappingOpen(false)}
        headers={Object.keys(rows[0] ?? {})}
        onFinish={(map) => {
          const mapped = rows.map((r) => {
            const nr: any = {};
            Object.keys(map).forEach((target) => {
              const from = map[target];
              nr[target] = r[from];
            });
            return nr;
          });
          setRows(mapped);
          setMappingOpen(false);
        }}
      />

      {/* Inline Edit */}
      {inlineFixRow !== null && (
        <VisionOSInlineFix
          rowIndex={inlineFixRow}
          row={rows[inlineFixRow]}
          onEdit={(newRow) => {
            const clone = [...rows];
            clone[inlineFixRow] = newRow;
            setRows(clone);
          }}
        />
      )}

      {/* Duplicate Info Popup */}
      <VisionOSInfoSheet
        open={showDuplicateInfo}
        onClose={() => setShowDuplicateInfo(false)}
        title="Duplikate gefunden"
        lines={[
          `${duplicateIdx.length} Einträge existieren bereits`,
          "Diese werden beim Import automatisch übersprungen.",
        ]}
      />
    </>
  );
}

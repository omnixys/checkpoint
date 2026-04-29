// path: src/checkpoint/components/invitation/InvitationImportDialog.tsx

"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import VisionDropzone from "@/checkpoint/components/vision/VisionDropzone";
import { VisionOSProgress } from "@/checkpoint/components/vision/VisionOSProgress";
import { VisionOSSuccessSheet } from "@/checkpoint/components/vision/VisionOSSuccessSheet";
import { VisionOSInfoSheet } from "@/checkpoint/components/vision/VisionOSInfoSheet";

import { getLogger } from "@/checkpoint/utils/logger";
import DialogTransition from "@/checkpoint/components/DialogTransition";
import { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import VisionColumnMapping from "@/checkpoint/components/vision/VisionColumnMapping";
import VisionPreviewTable from "@/checkpoint/components/vision/VisionPreviewTable";

/* ---------------------------------------------------------------------------
 * COMPONENT
 * ------------------------------------------------------------------------- */
export default function InvitationImportDialog({ logic }: { logic: InvitationLogic }) {
  const logger = getLogger("InvitationImportDialog");

  const [file, setFile] = useState<File | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showDuplicateInfo, setShowDuplicateInfo] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [importCount, setImportCount] = useState(0);
  const [mappingOpen, setMappingOpen] = useState(false);
  const [mapping, setMapping] = useState<Record<string, string>>({});

  /* -----------------------------------------------------------------------
   * RESET STATE
   * --------------------------------------------------------------------- */
  function resetState() {
    setFile(null);
    setErrors([]);
    setImportCount(0);
    setShowDuplicateInfo(false);
    logic.resetImport();
  }

  /* -----------------------------------------------------------------------
   * HANDLE FILE → UPLOAD + PREVIEW
   * --------------------------------------------------------------------- */
  async function handleFile(f: File | null) {
    if (!f) return;

    setFile(f);
    setErrors([]);

    try {
      /**
       * ---------------- Upload ----------------
       */
      const uploadResult = await logic.uploadFile(f);

      if (!uploadResult?.key) {
        throw new Error("Upload returned no key");
      }

      /**
       * ---------------- Preview ----------------
       */
      const preview = await logic.previewFile({
        key: uploadResult.key,
        type: uploadResult.type,
      });

      if (!preview) {
        throw new Error("Preview returned no data");
      }

      /**
       * ---------------- Mapping ----------------
       */
      if (preview?.mapping) {
        const required = ["firstName", "lastName"];

        const missing = required.filter((r) => !Object.values(preview.mapping).includes(r));

        if (missing.length > 0) {
          setMapping(preview.mapping);
          setMappingOpen(true);
        }
      }

      /**
       * ---------------- Backend Validation ----------------
       */
      if (preview.errors?.length) {
        setErrors(preview.errors);
      }
    } catch (err: unknown) {
      console.error("🔥 FULL ERROR:", err);

      let message = "Upload oder Preview fehlgeschlagen";

      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }

      setErrors([message]);

      logger.error("Upload/Preview failed", {
        message,
        raw: err,
        fileName: f.name,
        fileSize: f.size,
        fileType: f.type,
      });
    }
  }

  /* -----------------------------------------------------------------------
   * SUBMIT (IMPORT)
   * --------------------------------------------------------------------- */
  async function submit() {
    if (!file) return;

    setErrors([]);

    try {
      const res = await logic.executeImport();

      const result = res?.data?.importInvitations;

      if (!result) {
        throw new Error("No result returned");
      }

      /* ---------------- Backend Result ---------------- */
      if (result.errors.length > 0) {
        setErrors(result.errors);
      }

      if (result.duplicates.length > 0) {
        setShowDuplicateInfo(true);
      }

      setImportCount(result.imported);

      /* ---------------- Refresh ---------------- */
      await logic.reload();

      /* ---------------- Success UX ---------------- */
      setTimeout(() => {
        setShowSuccess(true);
        logic.setImportOpen(false);
        resetState();
      }, 300);
    } catch (err) {
      logger.error("Import failed", err);
      setErrors(["Import fehlgeschlagen"]);
    }
  }

  /* -----------------------------------------------------------------------
   * RENDER
   * --------------------------------------------------------------------- */
  return (
    <>
      <Dialog
        open={logic.importOpen}
        onClose={() => logic.setImportOpen(false)}
        maxWidth="lg"
        fullWidth
        slots={{ transition: DialogTransition }}
      >
        <DialogTitle>Gästeliste importieren</DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <VisionDropzone file={file} onSelect={handleFile} />

            {/* Errors */}
            {errors.length > 0 && (
              <Box color="error.main">
                {errors.map((e, i) => (
                  <Typography key={i}>{e}</Typography>
                ))}
              </Box>
            )}

            {/* File Info */}
            {file && (
              <Typography variant="body2" color="text.secondary">
                Datei: {file.name}
              </Typography>
            )}

            {/* 🔥 PREVIEW INFO */}
            {logic.preview && (
              <VisionPreviewTable
                rows={logic.preview.rows}
                duplicates={logic.preview.duplicates}
                errors={logic.preview.errors}
                onChange={(updated) => {
                  console.log("UPDATED ROWS", updated);
                }}
              />
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => logic.setImportOpen(false)}>Abbrechen</Button>

          <Button variant="contained" disabled={!logic.key || !logic.preview} onClick={submit}>
            Import starten
          </Button>
        </DialogActions>
      </Dialog>

      <VisionColumnMapping
        open={mappingOpen}
        headers={logic.preview?.headers ?? []}
        mapping={mapping}
        onChange={setMapping}
        onClose={() => setMappingOpen(false)}
      />

      {/* Progress */}
      {logic.importProgress > 0 && logic.importProgress < 100 && (
        <VisionOSProgress progress={logic.importProgress} />
      )}

      {/* Success */}
      <VisionOSSuccessSheet
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        count={importCount}
      />

      {/* Duplicate Info */}
      <VisionOSInfoSheet
        open={showDuplicateInfo}
        onClose={() => setShowDuplicateInfo(false)}
        title="Duplikate erkannt"
        lines={["Einige Einträge existieren bereits.", "Diese wurden automatisch übersprungen."]}
      />
    </>
  );
}

"use client";

import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { MotionDialogTransition } from "@/checkpoint/components/motion/MotionDialogTransition";
import type { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

export default function InvitationBulkDeleteDialog({ logic }: { logic: InvitationLogic }) {
  const t = useTypedTranslations("invitation");

  const ids = logic.bulkDeleteIds;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = ids !== null && ids.length > 0;
  const count = ids?.length ?? 0;
  const loading = submitting || logic.removeInvitationsLoading;

  const close = () => {
    if (loading) return;
    setError(null);
    logic.closeBulkDeleteDialog();
  };

  const confirm = async () => {
    if (!ids || ids.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      await logic.submitBulkDelete(ids);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      slots={{ transition: MotionDialogTransition }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{t("deleteConfirm.bulkTitle", { count })}</DialogTitle>
      <DialogContent>
        {error ? (
          <Alert severity="error">
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        ) : (
          <Typography>{t("deleteConfirm.bulkMessage", { count })}</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={close}>{t("deleteConfirm.cancel")}</Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteForeverRoundedIcon />}
          disabled={loading}
          onClick={() => void confirm()}
        >
          {t("deleteConfirm.bulkConfirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { MotionDialogTransition } from "@/checkpoint/components/motion/MotionDialogTransition";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

interface Props {
  open: boolean;
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function InvitationDeleteConfirmDialog({ open, name, onCancel, onConfirm }: Props) {
  const t = useTypedTranslations("invitation");

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      slots={{ transition: MotionDialogTransition }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{t("deleteConfirm.title")}</DialogTitle>
      <DialogContent>
        <Typography>{t("deleteConfirm.message", { name })}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel}>{t("deleteConfirm.cancel")}</Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          {t("deleteConfirm.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from "@mui/material";
import { MotionDialogTransition } from "@/checkpoint/components/motion/MotionDialogTransition";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeviceBindingConfirmDialog({ open, onCancel, onConfirm }: Props) {
  const theme = useTheme();
  const tQr = useTypedTranslations("qr");

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      slots={{ transition: MotionDialogTransition }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{tQr("deviceReactivationTitle")}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          {tQr("deviceReactivationMessage")}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onCancel}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 999,
            color: theme.palette.text.secondary,
          }}
        >
          {tQr("deviceReactivationCancel")}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 999,
            py: 1,
            px: 2.5,
          }}
        >
          {tQr("deviceReactivationConfirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

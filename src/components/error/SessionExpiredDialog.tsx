"use client";

import LoginIcon from "@mui/icons-material/Login";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { AppError } from "@/checkpoint/errors/app-error";

interface SessionExpiredDialogProps {
  readonly open: boolean;
  readonly error: AppError | null;
  readonly onContinue: () => void;
}

export default function SessionExpiredDialog({
  open,
  error,
  onContinue,
}: SessionExpiredDialogProps) {
  return (
    <Dialog open={open} aria-labelledby="session-expired-title">
      <DialogTitle id="session-expired-title">Session expired</DialogTitle>
      <DialogContent>
        <Typography>Your session is no longer valid. Sign in to continue.</Typography>
        {error?.requestId && (
          <Typography variant="caption" color="text.secondary">
            Reference: {error.requestId}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" startIcon={<LoginIcon />} onClick={onContinue}>
          Continue to sign in
        </Button>
      </DialogActions>
    </Dialog>
  );
}

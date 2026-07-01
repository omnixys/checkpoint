"use client";

import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface RetryComponentProps {
  readonly open: boolean;
  readonly title: string;
  readonly message: string;
  readonly requestId?: string | undefined;
  readonly onRetry: () => void;
  readonly onDismiss?: (() => void) | undefined;
}

export default function RetryComponent({
  open,
  title,
  message,
  requestId,
  onRetry,
  onDismiss,
}: RetryComponentProps) {
  return (
    <Dialog open={open} onClose={onDismiss} aria-labelledby="retry-dialog-title">
      <DialogTitle id="retry-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
        {requestId && (
          <Typography variant="caption" color="text.secondary">
            Reference: {requestId}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        {onDismiss && <Button onClick={onDismiss}>Close</Button>}
        <Button variant="contained" startIcon={<RefreshIcon />} onClick={onRetry}>
          Retry
        </Button>
      </DialogActions>
    </Dialog>
  );
}

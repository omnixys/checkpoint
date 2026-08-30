"use client";

import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { ErrorCode } from "@omnixys/contracts-ts/errors";
import type { AppError } from "@/checkpoint/errors/app-error";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

type ErrorCodeKey =
  | "errors.RSVP_NOT_SUBMITTED"
  | "errors.RSVP_NOT_ACCEPTED"
  | "errors.INVITATION_PREVIEW_FAILED"
  | "errors.SEAT_ALLOCATION_EXCEEDED";

/**
 * Registry of error codes surfaced as a localizable dialog.
 * Extend this map (and the matching `errors.*` keys in messages/) when new
 * business error codes should render a titled dialog instead of a generic toast.
 */
const DIALOG_MESSAGE_KEYS: Readonly<Partial<Record<ErrorCode, ErrorCodeKey>>> = {
  [ErrorCode.RSVP_NOT_SUBMITTED]: "errors.RSVP_NOT_SUBMITTED",
  [ErrorCode.RSVP_NOT_ACCEPTED]: "errors.RSVP_NOT_ACCEPTED",
  [ErrorCode.INVITATION_PREVIEW_FAILED]: "errors.INVITATION_PREVIEW_FAILED",
  [ErrorCode.SEAT_ALLOCATION_EXCEEDED]: "errors.SEAT_ALLOCATION_EXCEEDED",
};

interface ErrorCodeDialogProps {
  readonly open: boolean;
  readonly error: AppError | null;
  readonly onClose: () => void;
}

export default function ErrorCodeDialog({ open, error, onClose }: ErrorCodeDialogProps) {
  const t = useTypedTranslations("invitation");
  const tError = useTypedTranslations("error");

  const key = error ? DIALOG_MESSAGE_KEYS[error.code] : undefined;

  const title = key ? t(`${key}.title`) : tError("generic");
  const message = key ? t(`${key}.message`) : tError("generic");

  return (
    <Dialog open={open && error !== null} onClose={onClose} aria-labelledby="error-code-title">
      <DialogTitle id="error-code-title">{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
        {error?.requestId && (
          <Typography variant="caption" color="text.secondary">
            Reference: {error.requestId}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ErrorOutlineRoundedIcon />} onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

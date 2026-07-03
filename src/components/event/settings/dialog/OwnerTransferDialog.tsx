"use client";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { glassInputSx } from "@/checkpoint/themes/styles/glassInput";
import type { EventRoleType } from "@/checkpoint/types/event.type";

/**
 * OwnerTransferDialog
 *
 * SECURITY CRITICAL COMPONENT
 *
 * Guarantees:
 * - Only ADMIN users selectable
 * - No manual ID injection
 * - Explicit confirmation required
 * - State reset on close
 */
interface Props {
  open: boolean;
  onClose: () => void;
  currentOwnerId: string;
  roles: EventRoleType[];
  onTransfer: (newOwnerId: string) => void;
}

export default function OwnerTransferDialog({
  open,
  onClose,
  currentOwnerId,
  roles,
  onTransfer,
}: Props) {
  const theme = useTheme();

  /**
   * Strongly typed state
   */
  const [newOwnerId, setNewOwnerId] = useState<string>("");
  const [confirmText, setConfirmText] = useState<string>("");

  /**
   * Only ADMIN users are eligible for ownership transfer
   */
  const possibleOwners = useMemo(() => roles.filter((r) => r.role === "ADMIN"), [roles]);

  /**
   * Required confirmation phrase
   */
  const RequiredConfirmation = "TRANSFER";

  /**
   * Validation logic
   */
  const isValid =
    newOwnerId !== "" && newOwnerId !== currentOwnerId && confirmText === RequiredConfirmation;

  /**
   * Reset state when dialog closes
   */
  useEffect(() => {
    if (!open) {
      setNewOwnerId("");
      setConfirmText("");
    }
  }, [open]);

  /**
   * Execute transfer
   */
  const handleTransfer = () => {
    if (!isValid) {
      return;
    }

    onTransfer(newOwnerId);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true}>
      <DialogTitle>Transfer Ownership</DialogTitle>

      <DialogContent>
        <Stack
          spacing={2}
          sx={{
            mt: 1,
          }}
        >
          {/* WARNING */}
          <Alert severity="warning">
            This action is irreversible. You will lose full control of this event.
          </Alert>

          {/* OWNER SELECT */}
          <TextField
            select={true}
            label="New Owner"
            value={newOwnerId}
            onChange={(e) => setNewOwnerId(e.target.value)}
            fullWidth={true}
            disabled={possibleOwners.length === 0}
            sx={glassInputSx(theme)}
          >
            <MenuItem value="">
              <em>Select new owner</em>
            </MenuItem>

            {possibleOwners.map((o) => (
              <MenuItem key={o.userId} value={o.userId} disabled={o.userId === currentOwnerId}>
                {o.userId}
              </MenuItem>
            ))}
          </TextField>

          {/* CONFIRMATION */}
          <Stack spacing={1}>
            <Typography variant="caption">
              Type <b>{RequiredConfirmation}</b> to confirm
            </Typography>

            <TextField
              placeholder={RequiredConfirmation}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              sx={glassInputSx(theme)}
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" color="error" disabled={!isValid} onClick={handleTransfer}>
          Transfer Ownership
        </Button>
      </DialogActions>
    </Dialog>
  );
}

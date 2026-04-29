"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  MenuItem,
  Select,
  Box,
  useTheme,
  alpha,
} from "@mui/material";
import { InvitationPayload } from "@/checkpoint/generated/graphql";
import { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

/* ---------------------------------------------------------------------------
 * Bulk Send Dialog with Locale Selection
 * ------------------------------------------------------------------------- */
export default function InvitationBulkSendDialog({ logic }: { logic: InvitationLogic }) {
  const theme = useTheme();
  const open = logic.sendOpen;
  const tInvitation = useTypedTranslations("invitation");
  const tCommon = useTypedTranslations("common");

  if (!open) return null;

  const selectedInvitations = logic.invitations.filter((inv) =>
    logic.bulkSendIds?.includes(inv.id),
  );

  return (
    <Dialog open={open} onClose={logic.closeBulkSendDialog} maxWidth="sm" fullWidth>
      <DialogTitle> {tInvitation("bulkSend.title")}</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          {selectedInvitations.map((inv) => (
            <Box
              key={inv.id}
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Stack spacing={1}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  {inv.firstName} {inv.lastName}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {inv.email ?? inv.phoneNumber ?? tCommon("empty")}
                </Typography>

                {/* 🔥 Locale Select */}
                <Select
                  size="small"
                  value={logic.bulkLocales[inv.id] ?? "en-US"}
                  onChange={(e) => logic.setGuestLocale(inv.id, e.target.value)}
                >
                  <MenuItem value="en-US">{tCommon("language.en-US")}</MenuItem>
                  <MenuItem value="de-DE">{tCommon("language.de-DE")}</MenuItem>
                </Select>
              </Stack>
            </Box>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={logic.closeBulkSendDialog}>{tCommon("cancel")}</Button>

        <Button
          variant="contained"
          disabled={logic.sendingBulk}
          onClick={() => logic.sendBulkInvitations(logic.bulkSendIds ?? [])}
        >
          {tInvitation("bulkSend.send")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

export interface InvitationBulkApproveDialogProps {
  logic: InvitationLogic;
}

export default function InvitationBulkApproveDialog({ logic }: InvitationBulkApproveDialogProps) {
  const theme = useTheme();
  const tInvitation = useTypedTranslations("invitation");
  const tCommon = useTypedTranslations("common");
  const finalizing = logic.approvalDialogMode === "finalize";

  return (
    <Dialog
      open={logic.approveOpen}
      onClose={logic.closeBulkApproveDialog}
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle>
        {finalizing
          ? tInvitation("approvalWorkflow.finalizeTitle")
          : tInvitation("approvalWorkflow.stageTitle")}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {logic.bulkApproveInvitationList.map((invitation) => {
            const entry = logic.bulkApproveEntries[invitation.id];
            const seatOptions = entry
              ? (logic.seatOptionsByEventId[entry.eventId] ?? []).filter(
                  (seat) =>
                    ((!seat.guestId && !seat.invitationId) ||
                      seat.invitationId === invitation.id) &&
                    !Object.values(logic.bulkApproveEntries).some(
                      (otherEntry) =>
                        otherEntry.invitationId !== invitation.id && otherEntry.seatId === seat.id,
                    ),
                )
              : [];
            const selectedSeat = seatOptions.find((seat) => seat.id === entry?.seatId);

            return (
              <Box
                key={invitation.id}
                sx={{
                  borderRadius: 3,
                  p: 2,
                  border:
                    invitation.plusOneAgeCategory === "OVER_SIX"
                      ? `1px solid ${alpha(theme.palette.info.main, 0.3)}`
                      : invitation.plusOneAgeCategory === "UNDER_SIX"
                        ? `1px solid ${alpha(theme.palette.warning.main, 0.3)}`
                        : `1px solid ${alpha(theme.palette.divider, 0.9)}`,
                  backgroundColor:
                    invitation.plusOneAgeCategory === "OVER_SIX"
                      ? alpha(theme.palette.info.main, 0.06)
                      : invitation.plusOneAgeCategory === "UNDER_SIX"
                        ? alpha(theme.palette.warning.main, 0.06)
                        : alpha(theme.palette.background.paper, 0.75),
                }}
              >
                <Stack spacing={2}>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      {`${invitation.firstName ?? ""} ${invitation.lastName ?? ""}`.trim() ||
                        invitation.email ||
                        invitation.id}
                    </Typography>

                    {/* <Typography variant="body2" color="text.secondary">
                      {tInvitation("bulkApprove.invitationId", {
                        id: invitation.id,
                      })}
                    </Typography> */}
                  </Box>

                  <Stack spacing={1.5}>
                    <Typography variant="body2" color="text.secondary">
                      {logic.eventNameById[invitation.eventId] ?? invitation.eventName}
                    </Typography>

                    {/* SEAT */}
                    <FormControl fullWidth={true}>
                      <InputLabel id={`bulk-approve-seat-${invitation.id}`}>
                        {tInvitation("bulkApprove.seat")}
                      </InputLabel>
                      <Select
                        labelId={`bulk-approve-seat-${invitation.id}`}
                        label={tInvitation("bulkApprove.seat")}
                        value={entry?.seatId ?? ""}
                        onChange={(event) =>
                          logic.setBulkApproveSeat(
                            invitation.id,
                            event.target.value ? event.target.value : null,
                          )
                        }
                      >
                        <MenuItem value="">{tInvitation("bulkApprove.noSeat")}</MenuItem>

                        {seatOptions.map((seatOption) => (
                          <MenuItem key={seatOption.id} value={seatOption.id}>
                            {seatOption.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>

                  <Typography variant="caption" color="text.secondary">
                    {tInvitation("bulkApprove.selectedSeat", {
                      seat: selectedSeat?.label ?? tInvitation("bulkApprove.noSeat"),
                    })}
                  </Typography>
                </Stack>
              </Box>
            );
          })}

          {logic.bulkApproveInvitationList.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              {tInvitation("bulkApprove.empty")}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={logic.closeBulkApproveDialog}> {tCommon("cancel")}</Button>

        <Button
          variant="contained"
          onClick={() => logic.submitApprovalDialog()}
          disabled={logic.approvalMutationLoading || logic.bulkApproveInvitationList.length === 0}
        >
          {logic.approvalMutationLoading
            ? tInvitation("approvalWorkflow.saving")
            : finalizing
              ? tInvitation("approvalWorkflow.finalizeSubmit", {
                  count: logic.bulkApproveInvitationList.length,
                })
              : tInvitation("approvalWorkflow.stageSubmit", {
                  count: logic.bulkApproveInvitationList.length,
                })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

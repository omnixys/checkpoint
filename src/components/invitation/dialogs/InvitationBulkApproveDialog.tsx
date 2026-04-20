"use client";

import { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
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

export interface InvitationBulkApproveDialogProps {
  logic: InvitationLogic;
}

export default function InvitationBulkApproveDialog({ logic }: InvitationBulkApproveDialogProps) {
  const theme = useTheme();
    const tInvitation = useTypedTranslations("invitation");
      const tCommon = useTypedTranslations("common");

  
const LOCALE_OPTIONS = [
  { value: "en-US", label: tCommon("language.en-US") },
  { value: "de-DE", label: tCommon("language.de-DE") },
];
  
  return (
    <Dialog
      open={logic.approveOpen}
      onClose={logic.closeBulkApproveDialog}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle> {tInvitation("bulkApprove.title")}</DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {logic.bulkApproveInvitationList.map((invitation) => {
            const entry = logic.bulkApproveEntries[invitation.id];
            const seatOptions = entry
              ? (logic.seatOptionsByEventId[entry.eventId] ?? [])
              : [];

            return (
              <Box
                key={invitation.id}
                sx={{
                  borderRadius: 3,
                  p: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
                  backgroundColor: alpha(theme.palette.background.paper, 0.75),
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

                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <FormControl fullWidth>
                      <InputLabel id={`bulk-approve-locale-${invitation.id}`}>
                        {tInvitation("bulkApprove.locale")}
                      </InputLabel>
                      <Select
                        labelId={`bulk-approve-locale-${invitation.id}`}
                        label={tInvitation("bulkApprove.locale")}
                        value={entry?.locale ?? "en-US"}
                        onChange={(event) =>
                          logic.setBulkApproveLocale(
                            invitation.id,
                            event.target.value,
                          )
                        }
                      >
                        {LOCALE_OPTIONS.map((locale) => (
                          <MenuItem key={locale.value} value={locale.value}>
                            {locale.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* EVENT */}
                    <FormControl fullWidth>
                      <InputLabel id={`bulk-approve-event-${invitation.id}`}>
                        {tInvitation("bulkApprove.event")}
                      </InputLabel>
                      <Select
                        labelId={`bulk-approve-event-${invitation.id}`}
                        label={tInvitation("bulkApprove.event")}
                        value={entry?.eventId ?? invitation.eventId}
                        onChange={async (event) => {
                          await logic.setBulkApproveEvent(
                            invitation.id,
                            event.target.value,
                          );
                        }}
                      >
                        {logic.allEventOptions.map((eventOption) => (
                          <MenuItem key={eventOption.id} value={eventOption.id}>
                            {eventOption.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* SEAT */}
                    {/* TODO SELECT optimieren! mit Group und autocomplete */}
                    <FormControl fullWidth>
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
                        <MenuItem value="">
                          {tInvitation("bulkApprove.noSeat")}
                        </MenuItem>

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
                      seat: entry?.seatLabel ?? tCommon("empty"),
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
        <Button onClick={logic.closeBulkApproveDialog}>
          {" "}
          {tCommon("cancel")}
        </Button>

        <Button
          variant="contained"
          onClick={() => logic.bulkApprove()}
          disabled={
            logic.bulkApproving || logic.bulkApproveInvitationList.length === 0
          }
        >
          {logic.bulkApproving
            ? tInvitation("bulkApprove.loading")
            : tInvitation("bulkApprove.submit", {
                count: logic.bulkApproveInvitationList.length,
              })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

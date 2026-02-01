"use client";

import { useQuery } from "@apollo/client/react";
import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import { GET_INVITATION_TEMPLATES } from "@/components/../graphql/notification/notification.query";
import { Channel } from "@/components/../types/notification/notification-enum.type";
import { GetInvitationTemplatesResult } from "@/components/../types/notification/template-query-graphql.type";
import { UseInvitationLogicReturn } from "../../hooks/useInvitationLogic";

/* ---------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */
type Props = {
  logic: UseInvitationLogicReturn;
};

/* ---------------------------------------------------------------------------
 * Dialog
 * ------------------------------------------------------------------------- */
export default function BulkSendInvitationDialog({ logic }: Props) {
  const {
    bulkSendIds,
    bulkSendInvitations,
    closeBulkSendDialog,
    clearSelection,
    refetch,
  } = logic;

  const open = Boolean(bulkSendIds?.length);

  const { data, loading } = useQuery<GetInvitationTemplatesResult>(
    GET_INVITATION_TEMPLATES
  );

  const templates = data?.invitationTemplates ?? [];

  const [templateId, setTemplateId] = useState("");
  const [channels, setChannels] = useState<Channel[]>([Channel.EMAIL]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredTemplates = useMemo(
    () => templates.filter((t) => channels.includes(t.channel)),
    [templates, channels]
  );

  const canSubmit = Boolean(templateId) && Boolean(bulkSendIds?.length);

  function toggleChannel(ch: Channel) {
    setChannels((old) =>
      old.includes(ch) ? old.filter((c) => c !== ch) : [...old, ch]
    );
  }

  async function handleSend() {
    if (!canSubmit || !bulkSendIds) return;

    setSubmitting(true);
    setError(null);

    try {
      await bulkSendInvitations({
        variables: {
          input: {
            invitationIds: bulkSendIds,
            templateId,
          },
        },
      });

      clearSelection();
      closeBulkSendDialog();
      await refetch();
    } catch (e: any) {
      setError(e.message ?? "Bulk send failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={closeBulkSendDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Einladungen verschicken</DialogTitle>

      <DialogContent>
        <Stack spacing={3} mt={1}>
          <Typography variant="body2" color="text.secondary">
            {bulkSendIds?.length ?? 0} Einladung(en) werden versendet
          </Typography>

          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <TextField
              select
              label="Template"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              fullWidth
            >
              {filteredTemplates.map((tpl) => (
                <MenuItem key={tpl.id} value={tpl.id}>
                  {tpl.key} ({tpl.channel})
                </MenuItem>
              ))}
            </TextField>
          )}

          <Stack direction="row" spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={channels.includes(Channel.EMAIL)}
                  onChange={() => toggleChannel(Channel.EMAIL)}
                />
              }
              label="E-Mail"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={channels.includes(Channel.WHATSAPP)}
                  onChange={() => toggleChannel(Channel.WHATSAPP)}
                />
              }
              label="WhatsApp"
            />
          </Stack>

          {!canSubmit && (
            <Alert severity="info">Bitte Template auswählen.</Alert>
          )}

          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={closeBulkSendDialog} disabled={submitting}>
          Abbrechen
        </Button>
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!canSubmit || submitting}
        >
          {submitting ? "Wird versendet…" : "Jetzt versenden"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

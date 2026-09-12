"use client";

import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  Alert,
  AlertTitle,
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
} from "@mui/material";
import { useState } from "react";
import { MotionDialogTransition } from "@/checkpoint/components/motion/MotionDialogTransition";
import type { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

export default function InvitationResendDialog({ logic }: { logic: InvitationLogic }) {
  const t = useTypedTranslations("invitation");
  const tCommon = useTypedTranslations("common");

  const ids = logic.resendIds;
  const [submitting, setSubmitting] = useState(false);

  const open = ids !== null;
  const count = ids?.length ?? 0;
  const result = logic.resendResult;

  const close = () => {
    if (submitting) return;
    logic.closeBulkResendDialog();
  };

  const confirm = async () => {
    if (!ids || ids.length === 0) return;
    setSubmitting(true);
    try {
      await logic.resendConfirmations(ids);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      slots={{ transition: MotionDialogTransition }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{t("resend.title", { count })}</DialogTitle>
      <DialogContent>
        {result ? (
          <Alert severity={result.skipped === 0 ? "success" : "warning"}>
            <AlertTitle>{t("resend.completed")}</AlertTitle>
            <Typography variant="body2">
              {t("resend.summary", {
                total: result.total,
                resent: result.resent,
                skipped: result.skipped,
              })}
            </Typography>
          </Alert>
        ) : (
          <Stack spacing={2}>
            <Typography>{t("resend.message", { count })}</Typography>
            <FormControl fullWidth size="small">
              <InputLabel id="resend-locale">{t("resend.locale")}</InputLabel>
              <Select
                labelId="resend-locale"
                label={t("resend.locale")}
                value={logic.resendLocale ?? "de-DE"}
                onChange={(event) => logic.setResendLocale(event.target.value)}
                disabled={submitting}
              >
                <MenuItem value="de-DE">{tCommon("language.de-DE")}</MenuItem>
                <MenuItem value="en-US">{tCommon("language.en-US")}</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={close}>{t("resend.close")}</Button>
        {!result && (
          <Button
            variant="contained"
            startIcon={<SendRoundedIcon />}
            disabled={submitting}
            onClick={() => void confirm()}
          >
            {t("resend.confirm", { count })}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

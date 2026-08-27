"use client";

import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import type { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

/* ---------------------------------------------------------------------------
 * Floating bulk action bar for selected invitations
 * ------------------------------------------------------------------------- */
export interface InvitationBulkBarProps {
  logic: InvitationLogic;
}

export default function InvitationBulkBar({ logic }: InvitationBulkBarProps) {
  const t = useTypedTranslations("invitation");

  const theme = useTheme();
  const selected = logic.selected;
  const excludedCount = Math.max(
    0,
    selected.length - logic.stageableSelectedIds.length - logic.finalizableSelectedIds.length,
  );

  if (selected.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        width: { xs: "calc(100% - 24px)", sm: "auto" },
        maxWidth: "calc(100vw - 24px)",
        px: { xs: 1.5, sm: 3 },
        py: 2,
        borderRadius: "20px",
        backdropFilter: "blur(12px)",
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[4],
        zIndex: theme.zIndex.modal - 1,
      }}
    >
      <Stack spacing={1.25} sx={{ alignItems: "center" }}>
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
          {t("approvalWorkflow.selectionSummary", {
            selected: selected.length,
            stageable: logic.stageableSelectedIds.length,
            finalizable: logic.finalizableSelectedIds.length,
            excluded: excludedCount,
          })}
        </Typography>

        <Stack
          direction="row"
          spacing={{ xs: 1, sm: 2 }}
          sx={{
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {logic.canApprove && (
            <Button
              variant="contained"
              disabled={logic.stageableSelectedIds.length === 0}
              onClick={() => {
                void logic.openBulkApproveDialog(logic.stageableSelectedIds, "stage");
              }}
            >
              {t("approvalWorkflow.stage", { count: logic.stageableSelectedIds.length })}
            </Button>
          )}

          {logic.canApprove && (
            <Button
              variant="contained"
              color="success"
              disabled={logic.finalizableSelectedIds.length === 0}
              onClick={() => {
                void logic.openBulkApproveDialog(logic.finalizableSelectedIds, "finalize");
              }}
            >
              {t("approvalWorkflow.finalize", { count: logic.finalizableSelectedIds.length })}
            </Button>
          )}

          <Button variant="outlined" onClick={() => logic.openBulkSendDialog(selected)}>
            {t("bulk.send")}
          </Button>

          <Button variant="outlined" onClick={logic.clearSelection}>
            {t("bulk.clear")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

"use client";

import { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { Box, Button, Stack, useTheme } from "@mui/material";

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
      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2 }}
        sx={{
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            void logic.openBulkApproveDialog(selected);
          }}
        >
          {t("bulk.approve", { count: selected.length })}
        </Button>

        <Button variant="outlined" onClick={() => logic.openBulkSendDialog(selected)}>
          {t("bulk.send")}
        </Button>

        <Button variant="outlined" onClick={logic.clearSelection}>
          {t("bulk.clear")}
        </Button>
      </Stack>
    </Box>
  );
}

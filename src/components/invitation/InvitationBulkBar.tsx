"use client";

import { InvitationLogic } from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { Box, Button, Stack, useTheme } from "@mui/material";

/* ---------------------------------------------------------------------------
 * Floating bulk action bar for selected invitations
 * ------------------------------------------------------------------------- */
export interface InvitationBulkBarProps {
  logic: InvitationLogic;
}

export default function InvitationBulkBar({ logic }: InvitationBulkBarProps) {
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
        px: 3,
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
        spacing={2}
        sx={{
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            void logic.openBulkApproveDialog(selected);
          }}
        >
          Alle genehmigen ({selected.length})
        </Button>

        <Button variant="outlined" onClick={() => logic.openBulkSendDialog(selected)}>
          Einladungen verschicken
        </Button>

        <Button variant="outlined" onClick={logic.clearSelection}>
          Auswahl löschen
        </Button>
      </Stack>
    </Box>
  );
}

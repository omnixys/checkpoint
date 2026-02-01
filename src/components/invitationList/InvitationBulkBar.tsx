"use client";

import React from "react";
import { Box, Button, Stack, useTheme } from "@mui/material";

/* ---------------------------------------------------------------------------
 * Floating bulk action bar for selected invitations
 * ------------------------------------------------------------------------- */
export default function InvitationBulkBar({ logic }) {
  const theme = useTheme();
  const selected = logic.selected;

  if (selected.length === 0) return null;

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
      }}
    >
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={() =>
            logic
              .bulkApprove({
                variables: { ids: selected },
              })
              .then(() => logic.refetch())
          }
        >
          Alle genehmigen ({selected.length})
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={() =>
            logic
              .bulkApproveAndCreateTickets({
                variables: {
                  input: {
                    invitationIds: selected,
                    seatStrategy: "AUTO",
                  },
                },
              })
              .then(() => logic.refetch())
          }
        >
          Genehmigen + Ticket
        </Button>

        <Button
          variant="outlined"
          onClick={() => logic.openBulkSendDialog(selected)}
        >
          Einladungen verschicken
        </Button>
        
        <Button variant="outlined" onClick={logic.clearSelection}>
          Auswahl löschen
        </Button>
      </Stack>
    </Box>
  );
}

/** biome-ignore-all lint/suspicious/noEmptyBlockStatements: kp */
"use client";

import { useMutation } from "@apollo/client/react";
import { Box, CircularProgress, Dialog } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";
import RouteGuard from "@/checkpoint/components/guard/RouteGuard";
import CreateTicketDialog from "@/checkpoint/components/ticket/dialog/CreateTicketDialog";
import DeleteTicketDialog from "@/checkpoint/components/ticket/dialog/DeleteTicketDialog";
import TicketHeader from "@/checkpoint/components/ticket/TicketHeader";
import TicketList from "@/checkpoint/components/ticket/TicketList";
import {
  RevokeTicketDocument,
  type RevokeTicketMutation,
  type RevokeTicketMutationVariables,
} from "@/checkpoint/generated/graphql";
import useTicketQuery from "@/checkpoint/hooks/ticket/useTicketQuery";
import { getLogger } from "@/checkpoint/utils/logger";

export default function TicketClientPage() {
  const logger = getLogger("TicketPage");

  const theme = useTheme();
  const params = useParams();
  const eventId = params.id as string;

  /** -----------------------------------------------------------
   * Dialog States
   * --------------------------------------------------------- */
  const [openCreate, setOpenCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [_openRotate, _setOpenRotate] = useState(false);

  const { ticketPage, ticketPageLoading, ticketPageError } = useTicketQuery({
    eventId,
    loadTicketPage: true,
  });

  /** -----------------------------------------------------------
   * Mutations
   * --------------------------------------------------------- */
  const [revokeTicket] = useMutation<RevokeTicketMutation, RevokeTicketMutationVariables>(
    RevokeTicketDocument,
  );

  /** -----------------------------------------------------------
   * HANDLERS
   * --------------------------------------------------------- */

  const handleDelete = useCallback(async () => {
    if (!deleteId) {
      return;
    }
    await revokeTicket({ variables: { input: { ticketId: deleteId, reason: "Einfach SO" } } });
    setDeleteId(null);
  }, [revokeTicket, deleteId]);

  /** -----------------------------------------------------------
   * Loading & Error States
   * --------------------------------------------------------- */
  if (ticketPageLoading) {
    return (
      <Box
        sx={{
          minHeight: "40vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (ticketPageError || !ticketPage) {
    return (
      <Box sx={{ color: theme.palette.error.main, textAlign: "center", mt: 4 }}>
        Fehler beim Laden der Tickets.
      </Box>
    );
  }

  /** -----------------------------------------------------------
   * RENDER
   * --------------------------------------------------------- */
  return (
    <RouteGuard featureId="tickets">
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        sx={{
          px: { xs: 2, md: 4 },
          py: 3,
        }}
      >
        {/* ---------------- HEADER ---------------- */}
        <TicketHeader
          total={ticketPage.length}
          onCreate={() => setOpenCreate(true)}
          onFilter={() => logger.debug("filter logic")}
        />

        {/* ---------------- LISTE ---------------- */}
        <TicketList
          tickets={ticketPage} //TODO Request optimieren!!
          onOpen={(id) => logger.debug("open ticket", id)}
          onDelete={(id) => setDeleteId(id)}
          onFilter={() => logger.debug("filter logic")}
        />

        {/* ---------------- DIALOG: DELETE/REVOKE ---------------- */}
        <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} fullWidth={true} maxWidth="xs">
          <DeleteTicketDialog onCancel={() => setDeleteId(null)} onConfirm={handleDelete} />
        </Dialog>

        {/* ---------------- DIALOG: CREATE ---------------- */}
        <Dialog
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          fullWidth={true}
          maxWidth="sm"
        >
          <CreateTicketDialog onCancel={() => setOpenCreate(false)} onConfirm={() => {}} />
        </Dialog>
      </Box>
    </RouteGuard>
  );
}

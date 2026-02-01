"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { Box, CircularProgress, Dialog } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";

// Hook to read eventId from the URL
import CreateTicketDialog from "@/components/ticketList/CreateTicketDialog";
import DeleteTicketDialog from "@/components/ticketList/DeleteTicketDialog";
import RotateNonceDialog from "@/components/ticketList/RotateNonceDialog";
import TicketHeader from "@/components/ticketList/TicketHeader";
import TicketList from "@/components/ticketList/TicketList";
import {
  CREATE_TICKET,
  REVOKE_TICKET,
  ROTATE_TOKEN,
} from "@/graphql/ticket/ticket.mutation";
import { GET_TICKETS_BY_EVENT } from "@/graphql/ticket/ticket.query";
import {
  GetTicketsByEventRequest,
  GetTicketsByEventResult,
} from "@/types/ticket/ticket-graphql-query.type";
import { getLogger } from "@/utils/logger";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

export default function TicketPage() {
  const logger = getLogger("TicketPage");

    const router = useRouter();
      const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const params = useParams();
  const eventId = params.id as string;

  /** -----------------------------------------------------------
   * Dialog States
   * --------------------------------------------------------- */
  const [openCreate, setOpenCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openRotate, setOpenRotate] = useState(false);

  /** -----------------------------------------------------------
   * Query: Tickets for this event
   * --------------------------------------------------------- */
  const { data, loading, error, subscribeToMore } = useQuery<
    GetTicketsByEventResult,
    GetTicketsByEventRequest
  >(GET_TICKETS_BY_EVENT, {
    variables: { eventId },
    fetchPolicy: "cache-and-network",
  });

  /** -----------------------------------------------------------
   * Mutations
   * --------------------------------------------------------- */
  const [createTicket] = useMutation(CREATE_TICKET);
  const [revokeTicket] = useMutation(REVOKE_TICKET);
  const [rotateNonce] = useMutation(ROTATE_TOKEN);

  const tickets = data?.ticketsByEvent ?? [];

  /** -----------------------------------------------------------
   * HANDLERS
   * --------------------------------------------------------- */
  const handleCreate = useCallback(async () => {
    await createTicket({
      variables: { input: { eventId } },
    });
    setOpenCreate(false);
  }, [createTicket, eventId]);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    await revokeTicket({ variables: { ticketId: deleteId } });
    setDeleteId(null);
  }, [revokeTicket, deleteId]);

  const handleRotate = useCallback(async () => {
    await rotateNonce({ variables: { input: { eventId } } });
    setOpenRotate(false);
  }, [rotateNonce, eventId]);

    if (!isAuthenticated) {
      router.push("/checkpoint/");
    }
  /** -----------------------------------------------------------
   * Loading & Error States
   * --------------------------------------------------------- */
  if (loading) {
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

  if (error) {
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
        total={tickets.length}
        onCreate={() => setOpenCreate(true)}
        onFilter={() => logger.debug("filter logic")}
      />

      {/* ---------------- LISTE ---------------- */}
      <TicketList
        tickets={tickets}
        onOpen={(id) => logger.debug("open ticket", id)}
        onDelete={(id) => setDeleteId(id)}
      />

      {/* ---------------- DIALOG: CREATE ---------------- */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <CreateTicketDialog
          onCancel={() => setOpenCreate(false)}
          onConfirm={handleCreate}
        />
      </Dialog>

      {/* ---------------- DIALOG: DELETE/REVOKE ---------------- */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DeleteTicketDialog
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      </Dialog>

      {/* ---------------- DIALOG: ROTATE NONCE ---------------- */}
      <Dialog open={openRotate} onClose={() => setOpenRotate(false)}>
        <RotateNonceDialog
          onCancel={() => setOpenRotate(false)}
          onConfirm={handleRotate}
        />
      </Dialog>
    </Box>
  );
}

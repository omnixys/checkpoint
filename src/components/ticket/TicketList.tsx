"use client";

import { Grid } from "@mui/material";
import { motion } from "framer-motion";
import TicketCard from "@/checkpoint/components/ticket/TicketCard";
import type { TicketPageQuery } from "@/checkpoint/generated/graphql";
import useSeatQuery from "@/checkpoint/hooks/seat/useSeatQuery";

interface Props {
  tickets: TicketPageQuery["ticketsByEvent"];
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onFilter: () => void;
}

export default function TicketList({ tickets, onOpen, onDelete }: Props) {
  const { seatMap } = useSeatQuery({
    seatIdList: tickets.map((ticket) => ticket.seatId),
    loadSeatIdList: true,
  });

  const getSeatLabel = (seatId: string) => seatMap.get(seatId)?.label ?? "—";
  return (
    <Grid
      container={true}
      spacing={2.4}
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.06 },
        },
      }}
    >
      {tickets.map((t) => (
        <Grid
          size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          key={t.id}
          component={motion.div}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <TicketCard
            code={t.id}
            status={t.revoked ? "REVOKED" : "ACTIVE"}
            seatLabel={getSeatLabel(t.seatId)}
            presence={t.currentState}
            onOpen={() => onOpen(t.id)}
            onDelete={() => onDelete(t.id)}
          />
        </Grid>
      ))}
    </Grid>
  );
}

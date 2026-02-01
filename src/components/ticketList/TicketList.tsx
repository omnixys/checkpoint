"use client";

import { Ticket } from "@/types/ticket/ticket.type";
import { Grid } from "@mui/material";
import { motion } from "framer-motion";
import TicketCard from "./TicketCard";

type Props = {
  tickets: Ticket[];
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TicketList({ tickets, onOpen, onDelete }: Props) {
  return (
    <Grid
      container
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
          sx={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 3,
          }}
          key={t.id}
          component={motion.div}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <TicketCard
            code={t.id}
            status={"ACTIVE"}
            seatLabel={t.seatId}
            presence={t.currentState}
            onOpen={() => onOpen(t.id)}
            onDelete={() => onDelete(t.id)}
          />
        </Grid>
      ))}
    </Grid>
  );
}

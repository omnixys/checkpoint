"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { Box, CircularProgress, Button, Dialog } from "@mui/material";
import { gql } from "@apollo/client";
import SeatLayout from "./components/seat-layout/SeatLayout";
import SeatWizard from "./components/seat-wizard/SeatWizard";

const SEAT_LAYOUT_QUERY = gql`
  query SeatLayout($eventId: String!) {
    seatLayout(eventId: $eventId) {
      id
      name
      x
      y
      meta
      tables {
        id
        name
        x
        y
        meta
        sectionId
        seats {
          id
          x
          y
          rotation
          number
          status
          meta
          sectionId
          tableId
        }
      }
    }
  }
`;

export default function SeatsPage() {
  const { id: eventId } = useParams();

  const { data, loading, error, refetch } = useQuery(SEAT_LAYOUT_QUERY, {
    variables: { eventId },
  });

  const [wizardOpen, setWizardOpen] = React.useState(false);

  if (loading)
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );

  if (error) return <Box p={4}>❌ Fehler beim Laden des Sitzplans</Box>;

  const layout = data?.seatLayout ?? [];

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
      {/* 🔥 Wizard öffnen */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          onClick={() => setWizardOpen(true)}
          sx={{ mb: 2 }}
        >
          Layout automatisch generieren
        </Button>
      </Box>

      {/* 🎨 Canvas Rendering */}
      <SeatLayout layout={layout} />

      {/* 🧙 Wizard Dialog */}
      <Dialog
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            backdropFilter: "blur(30px)",
            background: "rgba(255,255,255,0.6)",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <SeatWizard
            eventId={eventId}
            onFinished={async () => {
              await refetch(); // 🔥 Canvas neu laden
              setWizardOpen(false); // Wizard schließen
            }}
          />
        </Box>
      </Dialog>
    </Box>
  );
}

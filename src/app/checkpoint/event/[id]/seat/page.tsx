"use client";

import BackToEventDetail from "@/components/invitationList/button/BackToEventDetail";
import CollapsingSeatHeader from "@/components/seatList/CollapsingSeatHeader";
import MapManager from "@/components/seatList/mapManager/MapManager";
import SeatDetailDrawer from "@/components/seatList/SeatDetailDrawer";
import SeatEditDialog from "@/components/seatList/SeatEditDialog";
import SeatFilters from "@/components/seatList/SeatFilters";
import SeatImportButton from "@/components/seatList/SeatImportButton";
import SeatImportDialog from "@/components/seatList/SeatImportDialog";
import { useSeatDetailDrawer } from "@/components/seatList/useSeatDetailDrawer";
import { useSeats } from "@/components/seatList/useSeats";
import { getLogger } from "@/utils/logger";
import { EditOutlined } from "@mui/icons-material";
import { alpha, Box, Button, Stack } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useActiveEvent } from "@/providers/ActiveEventProvider";

export default function SeatsPage() {
        const { isAuthenticated } = useAuth();
  const { id } = useParams();
  const logger = getLogger("SeatsPage");
  const eventId = id as string;
    const { activeRole   } = useActiveEvent();


  const {
    seats,
    seatsLoading,
    grouped,
    occupiedSeatIds,
    seatGuestMap,
    seatLabel,
    filter,
    setFilter,
    refetch,
    getSeatHolderLabel,
    assignSeat,
    invitationList,
    guestList,
  } = useSeats(eventId);
  const router = useRouter();
  const drawer = useSeatDetailDrawer();

  const selectedSeat = React.useMemo(
    () => seats.find((s) => s.id === drawer.seatId),
    [seats, drawer.seatId]
  );

  const [importOpen, setImportOpen] = React.useState(false);

    if (!isAuthenticated) {
      router.push("/checkpoint/");
    }

  return (
    <Stack spacing={3} sx={{ px: { xs: 1.5, md: 3 }, py: 2 }}>
      <Box
        sx={{
          position: "sticky",
          top: -35,
          zIndex: 50,
          pb: 1,
          bgcolor: (theme) => alpha(theme.palette.background.default, 0.7),
          backdropFilter: "blur(16px)",
          borderBottom: (theme) =>
            `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        }}
      >
        {/* Back Button */}
        <Stack direction="row" spacing={1} alignItems="center">
          <BackToEventDetail />

          {activeRole === "ADMIN" && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditOutlined />}
              onClick={() =>
                router.push(`/checkpoint/event/${eventId}/seat/edit`)
              }
            >
              Sitzstruktur
            </Button>
          )}
        </Stack>

        <CollapsingSeatHeader />

        <SeatFilters filter={filter} onChange={setFilter} />
      </Box>

      {activeRole === "ADMIN" && (
        <SeatImportButton onOpen={() => setImportOpen(true)} />
      )}

      <MapManager
        seats={seats}
        grouped={grouped}
        seatsLoading={seatsLoading}
        occupiedSeatIds={occupiedSeatIds}
        seatGuestMap={seatGuestMap}
        getSeatHolderLabel={getSeatHolderLabel}
        seatLabel={seatLabel}
        eventId={eventId}
        onSelect={(seat) => {
          drawer.show(seat); // 🔥 IMMER
        }}
        refetch={refetch}
      />

      <SeatDetailDrawer
        open={drawer.open}
        seat={selectedSeat}
        onClose={drawer.close}
        onEdit={drawer.edit}
        getSeatHolderLabel={getSeatHolderLabel}
        role={activeRole}
      />

      {drawer.editing && drawer.seatId && (
        <SeatEditDialog
          open={drawer.editing}
          seat={selectedSeat}
          invitationList={invitationList}
          guestList={guestList}
          onClose={drawer.stopEditing}
          onSave={async (input) => {
            await assignSeat({ variables: { input } });

            // 🔁 danach UI aktualisieren
            await refetch(); // aus useSeats(eventId)
            drawer.stopEditing();
          }}
        />
      )}

      <SeatImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={(rows) => {
          logger.debug("IMPORT CSV →", rows);
          setImportOpen(false);
        }}
      />
    </Stack>
  );
}

"use client";

import React, { useEffect } from "react";
import SeatDetailDrawer from "@/checkpoint/components/seat/drawer/SeatDetailDrawer";
import CollapsingSeatHeader from "@/checkpoint/components/seat/CollapsingSeatHeader";
import MapManager from "@/checkpoint/components/seat/mapManager/MapManager";
import SeatFilters from "@/checkpoint/components/seat/SeatFilters";
import SeatImportButton from "@/checkpoint/components/seat/SeatImportButton";
import { useSeatDetailDrawer } from "@/checkpoint/components/seat/useSeatDetailDrawer";
import { BackToEventDetailButton } from "@/checkpoint/components/utils/back-to-event-detail-button";
import { useSeats } from "@/checkpoint/hooks/seat/useSeats";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { getLogger } from "@/checkpoint/utils/logger";
import { EditOutlined, MapOutlined } from "@mui/icons-material";
import { alpha, Box, Button, Stack } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import SeatEditDialog from "@/checkpoint/components/seat/dialogs/SeatEditDialog";
import SeatImportDialog from "@/checkpoint/components/seat/dialogs/SeatImportDialog";
import { env } from "@/checkpoint/lib/env";
import { InvitationPayload, SeatPayload } from "@/checkpoint/generated/graphql";

export default function SeatsClientPage() {
  const { isAuthenticated } = useAuth();
  const { id } = useParams();
  const logger = getLogger("SeatsPage");
  const eventId = id as string;
  const { activeRole } = useActiveEvent();

  const {
    seats,
    seatListLoading,
    grouped,
    occupiedSeatIds,
    seatGuestMap,
    seatLabel,
    filter,
    setFilter,
    getSeatHolderLabel,
    assignSeat,
    invitationList,
    guestList,
    seatListRefetch,
  } = useSeats(eventId);
  const router = useRouter();
  const drawer = useSeatDetailDrawer();

  const selectedSeat = React.useMemo(
    () => seats.find((s) => s.id === drawer.seatId),
    [seats, drawer.seatId],
  );

  const [importOpen, setImportOpen] = React.useState(false);

useEffect(() => {
  if (!isAuthenticated) {
    router.replace(env.CHECKPOINT_BASE_PATH);
  }
}, [isAuthenticated, router]);

if (!isAuthenticated) {
  return null;
}

  return (
    <Stack spacing={3} sx={{ px: { xs: 1.5, md: 3 }, py: 2, minWidth: 0 }}>
      <Box
        sx={{
          position: "sticky",
          top: -35,
          zIndex: 50,
          pb: 1,
          bgcolor: (theme) => alpha(theme.palette.background.default, 0.7),
          backdropFilter: "blur(16px)",
          borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        }}
      >
        {/* Back Button */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <BackToEventDetailButton />

          {activeRole === "ADMIN" && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditOutlined />}
              onClick={() => router.push(`${env.CHECKPOINT_BASE_PATH}event/${eventId}/seat/edit`)}
              sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
            >
              Sitzstruktur
            </Button>
          )}

          <Button
            size="small"
            variant="outlined"
            startIcon={<MapOutlined />}
            onClick={() => router.push(`${env.CHECKPOINT_BASE_PATH}event/${eventId}/seat/map`)}
            sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
          >
            Karte
          </Button>
        </Stack>

        <CollapsingSeatHeader />

        <SeatFilters filter={filter} onChange={setFilter} />
      </Box>

      {activeRole === "ADMIN" && <SeatImportButton onOpen={() => setImportOpen(true)} />}

      <MapManager
        seats={seats}
        grouped={grouped}
        seatsLoading={seatListLoading}
        occupiedSeatIds={occupiedSeatIds}
        seatGuestMap={seatGuestMap}
        getSeatHolderLabel={getSeatHolderLabel}
        seatLabel={seatLabel}
        eventId={eventId}
        onSelect={(seat) => {
          drawer.show(seat); // 🔥 IMMER
        }}
        refetch={seatListRefetch}
      />

      <SeatDetailDrawer
        open={drawer.open}
        seat={selectedSeat}
        onClose={drawer.close}
        onEdit={drawer.edit}
        getSeatHolderLabel={getSeatHolderLabel}
        role={activeRole}
      />

      {drawer.editing && drawer.seatId && guestList && (
        <SeatEditDialog
          open={drawer.editing}
          seat={selectedSeat as SeatPayload}
          invitationList={invitationList as InvitationPayload[]}
          guestList={guestList}
          onClose={drawer.stopEditing}
          onSave={async (input) => {
            await assignSeat({ variables: { input } });

            // 🔁 danach UI aktualisieren
            await seatListRefetch(); // aus useSeats(eventId)
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

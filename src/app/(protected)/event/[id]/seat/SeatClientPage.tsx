"use client";

import { EditOutlined, MapOutlined } from "@mui/icons-material";
import { alpha, Box, Button, Stack } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import RouteGuard from "@/checkpoint/components/guard/RouteGuard";
import CollapsingSeatHeader from "@/checkpoint/components/seat/CollapsingSeatHeader";
import SeatEditDialog from "@/checkpoint/components/seat/dialogs/SeatEditDialog";
import SeatImportDialog from "@/checkpoint/components/seat/dialogs/SeatImportDialog";
import SeatDetailDrawer from "@/checkpoint/components/seat/drawer/SeatDetailDrawer";
import MapManager from "@/checkpoint/components/seat/mapManager/MapManager";
import SeatFilters from "@/checkpoint/components/seat/SeatFilters";
import SeatImportButton from "@/checkpoint/components/seat/SeatImportButton";
import { useSeatDetailDrawer } from "@/checkpoint/components/seat/useSeatDetailDrawer";
import { BackToEventDetailButton } from "@/checkpoint/components/utils/back-to-event-detail-button";
import type { InvitationPayload, SeatPayload } from "@/checkpoint/generated/graphql";
import { useSeats } from "@/checkpoint/hooks/seat/useSeats";
import { env } from "@/checkpoint/lib/env";
import { EventPermissionKey } from "@/checkpoint/lib/rbac/event-permissions";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useAnalytics } from "@/checkpoint/providers/AnalyticsProvider";
import { getLogger } from "@/checkpoint/utils/logger";

export default function SeatsClientPage() {
  const { id } = useParams();
  const logger = getLogger("SeatsPage");
  const eventId = id as string;
  const { activeRole, can } = useActiveEvent();
  const analytics = useAnalytics();
  const canManageSeats = can(EventPermissionKey.ManageSeats);

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

  return (
    <RouteGuard featureId="seats">
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

            {canManageSeats && (
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

        {canManageSeats && <SeatImportButton onOpen={() => setImportOpen(true)} />}

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
              analytics.track("SeatChangeStarted", { eventId });
              try {
                await assignSeat({ variables: { input } });
                await seatListRefetch();
                analytics.track("SeatChangeCompleted", { eventId });
                drawer.stopEditing();
              } catch (error) {
                analytics.track("SeatChangeFailed", { errorCode: "ASSIGNMENT_FAILED", eventId });
                throw error;
              }
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
    </RouteGuard>
  );
}

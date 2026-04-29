"use client";

import SectionInfoDialog from "@/checkpoint/components/seat/dialogs/SectionInfoDialog";
import TableInfoDialog from "@/checkpoint/components/seat/dialogs/TableInfoDialog";
import MapSwitcher, {
  MapType,
} from "@/checkpoint/components/seat/mapManager/MapSwitcher";
import SeatListView from "@/checkpoint/components/seat/mapManager/SeatListView";
import SeatMapRegular from "@/checkpoint/components/seat/mapManager/SeatMapRegular";
import { SeatListType } from "@/checkpoint/types/seat.type";
import { Box, Stack, useTheme } from "@mui/material";
import { useState } from "react";

export default function MapManager({
  seats,
  grouped,
  seatsLoading,
  occupiedSeatIds,
  seatGuestMap,
  onSelect,
  seatLabel,
  eventId,
  getSeatHolderLabel,
  refetch,
}: {
  seats: SeatListType[];
  grouped: Record<string, Record<string, SeatListType[]>>;
  seatsLoading: boolean;
  occupiedSeatIds: Set<string>;
  seatGuestMap: Map<string, string>;
  onSelect: (SeatPayload: SeatListType) => void;
  seatLabel: (SeatPayload: SeatListType) => string;
  eventId: string;
  getSeatHolderLabel: (SeatPayload: SeatListType) => string;
  refetch: () => void;
}) {
  const theme = useTheme();
  const [mapType, setMapType] = useState<MapType>("default");

  const [sectionDialog, setSectionDialog] = useState<{
    name: string;
    seats: SeatListType[];
  } | null>(null);

  const [tableDialog, setTableDialog] = useState<{
    name: string;
    seats: SeatListType[];
  } | null>(null);

  return (
    <Stack spacing={3} sx={{ width: "100%" }}>
      {/* Map Type Switcher */}
      <MapSwitcher value={mapType} onChange={setMapType} />

      {/* Renderer */}
      <Box sx={{ width: "100%", py: 2 }}>
        {mapType === "default" && (
          <SeatMapRegular
            seats={seats}
            grouped={grouped}
            seatsLoading={seatsLoading}
            occupiedSeatIds={occupiedSeatIds}
            seatGuestMap={seatGuestMap}
            getSeatHolderLabel={getSeatHolderLabel}
            // onSelectSeat={onSelect}
            onSelect={onSelect}
            onSectionClick={(sectionName, seats) =>
              setSectionDialog({ name: sectionName, seats })
            }
            onTableClick={(tableName, seats) =>
              setTableDialog({ name: tableName, seats })
            }
          />
        )}

        {mapType === "list" && (
          <SeatListView
            seats={seats}
            seatsLoading={seatsLoading}
            occupiedSeatIds={occupiedSeatIds}
            seatGuestMap={seatGuestMap}
            onSelectSeat={onSelect}
            seatLabel={seatLabel}
            eventId={eventId}
            getSeatHolderLabel={getSeatHolderLabel}
          />
        )}
      </Box>

      {/* Editor Toggle */}
      {/* <EditorToggleButton active={editor} onClick={() => setEditor(!editor)} /> */}

      {sectionDialog && (
        <SectionInfoDialog
          open
          sectionName={sectionDialog.name}
          seats={sectionDialog.seats}
          onClose={() => setSectionDialog(null)}
          refetch={refetch}
        />
      )}

      {tableDialog && (
        <TableInfoDialog
          open
          tableName={tableDialog.name}
          seats={tableDialog.seats}
          onClose={() => setTableDialog(null)}
          refetch={refetch}
        />
      )}
    </Stack>
  );
}

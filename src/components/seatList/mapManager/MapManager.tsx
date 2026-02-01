"use client";

import { Seat } from "@/components/../types/seat/seat.type";
import SectionInfoDialog from "@/components/seatList/dialogs/SectionInfoDialog";
import TableInfoDialog from "@/components/seatList/dialogs/TableInfoDialog";
import { Box, Stack, useTheme } from "@mui/material";
import React, { useState } from "react";
import MapSwitcher, { MapType } from "./MapSwitcher";
import SeatListView from "./SeatListView";
import SeatMapRegular from "./SeatMapRegular";

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
  seats: Seat[];
  grouped: Record<string, Record<string, Seat[]>>;
  seatsLoading: boolean;
  occupiedSeatIds: Set<string>;
  seatGuestMap: Map<string, string>;
  onSelect: (seat: Seat) => void;
  seatLabel: (seat: Seat) => string;
  eventId: string;
  getSeatHolderLabel: (seat: Seat) => string;
  refetch: () => void;
}) {
  const theme = useTheme();
  const [mapType, setMapType] = React.useState<MapType>("default");
  const [editor, setEditor] = React.useState(false);

  const [sectionDialog, setSectionDialog] = useState<{
    name: string;
    seats: Seat[];
  } | null>(null);

  const [tableDialog, setTableDialog] = useState<{
    name: string;
    seats: Seat[];
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

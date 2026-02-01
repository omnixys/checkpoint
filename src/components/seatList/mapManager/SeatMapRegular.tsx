"use client";

import { Seat } from "@/components/../types/seat/seat.type";
import VisionStrip from "@/components/seatList/vision/VisionStrip";
import VisionStripItem from "@/components/seatList/vision/VisionStripItem";
import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  Chip,
  LinearProgress,
  Stack,
} from "@mui/material";
import TableCluster from "./TableCluster";

type Props = {
  seats: Seat[];
  seatsLoading?: boolean;
  grouped: Record<string, Record<string, Seat[]>>;
  occupiedSeatIds: Set<string>;
  seatGuestMap: Map<string, string>;
  onSelect: (seat: Seat, guestId?: string, invitationId?: string) => void;
  getSeatHolderLabel: (seat: Seat) => string;

  onSectionClick?: (sectionName: string, seats: Seat[]) => void;
  onTableClick?: (tableName: string, seats: Seat[]) => void;
};

export default function SeatMapRegular({
  seats,
  seatsLoading = false,
  grouped,
  occupiedSeatIds,
  seatGuestMap,
  // onSelectSeat,
  onSelect,
  getSeatHolderLabel,
  onSectionClick,
  onTableClick,
}: Props) {
  const sectionKeys = Object.keys(grouped).sort((a, b) =>
    a.localeCompare(b, "de"),
  );

  if (seatsLoading) return <LinearProgress sx={{ mb: 2 }} />;

  if (sectionKeys.length === 0)
    return (
      <Alert severity="info" sx={{ mt: 1 }}>
        Noch keine Seats vorhanden.
      </Alert>
    );

  return (
    <Stack spacing={2} sx={{ mt: 1 }}>
      {/* Legende */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Chip
          size="small"
          label="frei"
          sx={{ bgcolor: "grey.900", color: "grey.100" }}
        />
        <Chip size="small" label="belegt" color="error" />
      </Stack>

      {sectionKeys.map((sectionKey) => {
        const tables = grouped[sectionKey];
        const tableKeys = Object.keys(tables).sort((a, b) =>
          a.localeCompare(b, "de"),
        );

        const sectionSeats = Object.values(tables).flat();

        return (
          <Card key={sectionKey} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardHeader
              onClick={() => onSectionClick?.(sectionKey, sectionSeats)}
              sx={{ cursor: "pointer" }}
              title={`Section ${sectionKey}`}
              titleTypographyProps={{
                variant: "subtitle1",
                sx: { fontWeight: 800 },
              }}
            />

            <CardContent sx={{ pt: 0 }}>
              <VisionStrip>
                {tableKeys.map((tableKey) => (
                  <VisionStripItem key={tableKey}>
                    <TableCluster
                      sectionName={sectionKey}
                      tableName={tableKey}
                      seats={tables[tableKey]}
                      occupiedSeatIds={occupiedSeatIds}
                      seatGuestMap={seatGuestMap}
                      getSeatHolderLabel={getSeatHolderLabel}
                      // onSeatClick={onSelectSeat}
                      onSeatClick={onSelect}
                      onTableClick={onTableClick}
                    />
                  </VisionStripItem>
                ))}
              </VisionStrip>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}

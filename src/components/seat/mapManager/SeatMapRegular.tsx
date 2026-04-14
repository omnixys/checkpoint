"use client";

import TableCluster from "@/checkpoint/components/seat/mapManager/TableCluster";
import VisionStrip from "@/checkpoint/components/vision/VisionStrip";
import VisionStripItem from "@/checkpoint/components/vision/VisionStripItem";
import { SeatPayload } from "@/checkpoint/generated/graphql";
import { QuerySeat } from "@/checkpoint/hooks/seat/useSeats";
import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  Chip,
  LinearProgress,
  Stack,
} from "@mui/material";

type Props = {
  seats: QuerySeat[];
  seatsLoading?: boolean;
  grouped: Record<string, Record<string, QuerySeat[]>>;
  occupiedSeatIds: Set<string>;
  seatGuestMap: Map<string, string>;
  onSelect: (seat: QuerySeat, guestId?: string, invitationId?: string) => void;
  getSeatHolderLabel: (seat: QuerySeat) => string;
  onSectionClick?: (sectionName: string, seats: QuerySeat[]) => void;
  onTableClick?: (tableName: string, seats: QuerySeat[]) => void;
};

export default function SeatMapRegular({
  seats,
  seatsLoading = false,
  grouped,
  occupiedSeatIds,
  seatGuestMap,
  onSelect,
  getSeatHolderLabel,
  onSectionClick,
  onTableClick,
}: Props) {
  const sectionKeys = Object.keys(grouped).sort((a, b) =>
    a.localeCompare(b, "de"),
  );

  if (seatsLoading) {
    return <LinearProgress sx={{ mb: 2 }} />;
  }

  if (sectionKeys.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 1 }}>
        Noch keine Seats vorhanden.
      </Alert>
    );
  }

  return (
    <Stack spacing={2} sx={{ mt: 1 }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
        }}
      >
        <Chip
          size="small"
          label="frei"
          sx={{ bgcolor: "grey.900", color: "grey.100" }}
        />
        <Chip size="small" label="belegt" color="error" />
      </Stack>

      {sectionKeys.map((sectionKey) => {
        const tables = grouped[sectionKey];

        if (!tables) {
          return null;
        }

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
                {tableKeys.map((tableKey) => {
                  const tableSeats = tables[tableKey];

                  if (!tableSeats) {
                    return null;
                  }

                  return (
                    <VisionStripItem key={tableKey}>
                      <TableCluster
                        sectionName={sectionKey}
                        tableName={tableKey}
                        seats={tableSeats}
                        occupiedSeatIds={occupiedSeatIds}
                        seatGuestMap={seatGuestMap}
                        getSeatHolderLabel={getSeatHolderLabel}
                        onSeatClick={onSelect}
                        {...(onTableClick
                          ? { onTableClick }
                          : {})}
                      />
                    </VisionStripItem>
                  );
                })}
              </VisionStrip>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}

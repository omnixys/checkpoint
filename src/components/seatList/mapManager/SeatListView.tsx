"use client";

import { Seat } from "@/components/../types/seat/seat.type";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

type Props = {
  seats: Seat[];
  seatsLoading?: boolean;
  occupiedSeatIds: Set<string>;
  seatGuestMap: Map<string, string>;
  onSelectSeat: (seat: Seat, guestId?: string) => void;
  seatLabel: (seat: Seat) => string;
  eventId: string;
  getSeatHolderLabel: (seat: Seat) => string;
};

export default function SeatListView({
  seats,
  seatsLoading = false,
  occupiedSeatIds,
  seatGuestMap,
  onSelectSeat,
  seatLabel,
  eventId,
  getSeatHolderLabel,
}: Props) {
  if (seatsLoading) return <LinearProgress sx={{ mb: 2 }} />;

  if (seats.length === 0)
    return (
      <Alert severity="info" sx={{ mt: 1 }}>
        Noch keine Seats vorhanden.
      </Alert>
    );

  return (
    <Stack spacing={1} sx={{ mt: 1 }}>
      {seats.map((s) => {
        const guestId = seatGuestMap.get(s.id);
        const fullName = (seat: Seat) => getSeatHolderLabel(seat);

        return (
          <Card
            key={s.id}
            variant="outlined"
            sx={{
              borderRadius: 2,
              cursor: "pointer",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
            onClick={() => onSelectSeat(s, guestId)}
          >
            <CardContent sx={{ py: 1.25 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography fontWeight={700}>
                  Section {s.section.name || "—"} • Tisch {s.table.name || "—"}{" "}
                  • Sitz {seatLabel(s)}
                </Typography>

                <Box flex={1} />

                <Chip
                  size="small"
                  label={guestId || s.invitationId ? "belegt" : "frei"}
                  color={guestId || s.invitationId ? "error" : "default"}
                  variant={guestId || s.invitationId ? "filled" : "outlined"}
                />
              </Stack>

              {/* GAST INFO */}
              {s.invitationId && (
                <Typography variant="body2" color="text.secondary">
                  {fullName(s)}
                  <Typography component="span" sx={{ ml: 1, opacity: 0.6 }}>
                    ({s.invitationId})
                  </Typography>
                </Typography>
              )}

              {guestId && (
                <Typography variant="body2" color="text.secondary">
                  {fullName(s)}
                  <Typography component="span" sx={{ ml: 1, opacity: 0.6 }}>
                    ({guestId})
                  </Typography>
                </Typography>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}

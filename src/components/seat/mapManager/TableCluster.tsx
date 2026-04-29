"use client";

import { SeatPayload } from "@/checkpoint/generated/graphql";
import { SeatListType } from "@/checkpoint/types/seat.type";
import { computeChairPositions, seatLabel } from "@/checkpoint/utils/seat/seating";
import SeatIcon from "@mui/icons-material/EventSeat";
import { Avatar, Box, Card, CardContent, CardHeader, Tooltip, Typography } from "@mui/material";

type Props = {
  sectionName: string;
  tableName: string;
  seats: SeatListType[];
  occupiedSeatIds?: Set<string>;
  seatGuestMap?: Map<string, string>;
  onSeatClick?: (seat: SeatListType) => void;
  onTableClick?: (tableName: string, seats: SeatListType[]) => void;
  getSeatHolderLabel: (seat: SeatListType) => string;
};

type ChairPosition = {
  left: number;
  top: number;
};

export default function TableCluster({
  sectionName,
  tableName,
  seats,
  occupiedSeatIds,
  seatGuestMap,
  onSeatClick,
  getSeatHolderLabel,
  onTableClick,
}: Props) {
  const containerSize = 260;
  const containerSizeMd = 320;
  const tableDiameter = 120;
  const tableDiameterMd = 160;
  const chairSize = 36;

  const chairsMobile = computeChairPositions(seats.length, containerSize, tableDiameter);
  const chairsMd = computeChairPositions(seats.length, containerSizeMd, tableDiameterMd);

  const fullName = (seat: SeatListType) => getSeatHolderLabel(seat);

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardHeader
        title={`Tisch ${tableName}`}
        subheader={`Section ${sectionName} • ${seats.length} Sitzplätze`}
        slotProps={{
          title: {
            variant: "subtitle1",
            sx: { fontWeight: 700 },
          },
          subheader: {
            variant: "caption",
          },
        }}
        avatar={<SeatIcon />}
        onClick={() => onTableClick?.(tableName, seats)}
        sx={{ borderRadius: 3, cursor: "pointer" }}
      />

      <CardContent sx={{ pt: 0 }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: { xs: containerSize, md: containerSizeMd },
              height: { xs: containerSize, md: containerSizeMd },
              mx: "auto",
            }}
          >
            {/* Tisch */}
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: tableDiameter, md: tableDiameterMd },
                height: { xs: tableDiameter, md: tableDiameterMd },
                borderRadius: "50%",
                bgcolor: "background.paper",
                border: "2px solid",
                borderColor: "divider",
                boxShadow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                color: "text.secondary",
              }}
            >
              Tisch {tableName}
            </Box>

            {/* Stühle */}
            {seats.map((seat, idx) => {
              const mobilePos: ChairPosition | undefined = chairsMobile[idx];
              const mdPos: ChairPosition | undefined = chairsMd[idx];

              if (!mobilePos || !mdPos) {
                return null;
              }

              const occupied = occupiedSeatIds?.has(seat.id) ?? false;
              const guestId = seatGuestMap?.get(seat.id);

              const tooltipContent = (
                <Box>
                  <Typography variant="caption">
                    <strong>Section:</strong> {seat.section.name ?? "—"}
                  </Typography>
                  <br />
                  <Typography variant="caption">
                    <strong>Table:</strong> {seat.table?.name ?? "—"}
                  </Typography>
                  <br />
                  <Typography variant="caption">
                    <strong>Seat:</strong> {seatLabel(seat)}
                  </Typography>

                  {seat.guestId && (
                    <>
                      <br />
                      <Typography variant="caption">Gast: {fullName(seat)}</Typography>
                    </>
                  )}

                  {seat.invitationId && (
                    <>
                      <br />
                      <Typography variant="caption">Einladung: {fullName(seat)}</Typography>
                    </>
                  )}

                  <br />
                  <Typography variant="caption">
                    <strong>Status:</strong> {occupied ? "belegt" : "frei"}
                  </Typography>

                  {seat.note && (
                    <>
                      <br />
                      <Typography variant="caption">
                        <strong>Notiz:</strong> {seat.note}
                      </Typography>
                    </>
                  )}

                  {guestId && (
                    <>
                      <br />
                      <Typography variant="caption" color="primary">
                        Zum Gastprofil klicken
                      </Typography>
                    </>
                  )}
                </Box>
              );

              return (
                <Tooltip key={seat.id} arrow placement="top" title={tooltipContent}>
                  <Avatar
                    onClick={() => onSeatClick?.(seat)}
                    sx={{
                      position: "absolute",
                      width: chairSize,
                      height: chairSize,
                      fontSize: 13,
                      fontWeight: 700,
                      bgcolor: occupied ? "error.main" : "grey.900",
                      color: occupied ? "error.contrastText" : "grey.100",
                      animation: "seatPop 0.4s ease-out",
                      "@keyframes seatPop": {
                        "0%": { transform: "scale(0.6)", opacity: 0 },
                        "80%": { transform: "scale(1.08)" },
                        "100%": { transform: "scale(1)", opacity: 1 },
                      },
                      left: {
                        xs: mobilePos.left - chairSize / 2,
                        md: mdPos.left - chairSize / 2,
                      },
                      top: {
                        xs: mobilePos.top - chairSize / 2,
                        md: mdPos.top - chairSize / 2,
                      },
                      border: "2px solid",
                      borderColor: "background.paper",
                      boxShadow: 1,
                      cursor: "pointer",
                    }}
                    aria-label={
                      guestId || seat.invitationId
                        ? "Zum Gastprofil wechseln"
                        : "Sitz ohne Gastzuordnung"
                    }
                    role={guestId || seat.invitationId ? "button" : undefined}
                  >
                    {seatLabel(seat)}
                  </Avatar>
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

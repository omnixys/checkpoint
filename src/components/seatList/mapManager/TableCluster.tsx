"use client";

import { Seat } from "@/components/../types/seat/seat.type";
import {
  computeChairPositions,
  seatLabel,
} from "@/components/../utils/seating";
import SeatIcon from "@mui/icons-material/EventSeat";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Tooltip,
  Typography,
} from "@mui/material";

type Props = {
  sectionName: string;
  tableName: string;
  seats: Seat[];
  occupiedSeatIds?: Set<string>;
  seatGuestMap?: Map<string, string>; // seatId -> guestProfileId
  onSeatClick?: (seat: Seat) => void;
  onTableClick?: (tableName: string, seats: Seat[]) => void;
  getSeatHolderLabel: (seat: Seat) => string;
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
  // Mobile-first
  const containerSize = 260;
  const containerSizeMd = 320;
  const tableDiameter = 120;
  const tableDiameterMd = 160;
  const chairSize = 36;

  const chairsMobile = computeChairPositions(
    seats.length,
    containerSize,
    tableDiameter
  );
  const chairsMd = computeChairPositions(
    seats.length,
    containerSizeMd,
    tableDiameterMd
  );

  const fullName = (seat: Seat) => getSeatHolderLabel(seat);

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardHeader
        title={`Tisch ${tableName}`}
        subheader={`Section ${sectionName} • ${seats.length} Sitzplätze`}
        titleTypographyProps={{ variant: "subtitle1", sx: { fontWeight: 700 } }}
        subheaderTypographyProps={{ variant: "caption" }}
        avatar={<SeatIcon />}
        onClick={() => onTableClick?.(tableName, seats)}
        sx={{ borderRadius: 3, cursor: "pointer" }}
      />
      <CardContent sx={{ pt: 0 }}>
        <Box
          sx={{
            width: "100%", // wichtig!
            display: "flex", // horizontales zentrieren
            justifyContent: "center", // GENAU HIER der Fix
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
            {seats.map((s, idx) => {
              const mobilePos = chairsMobile[idx];
              const mdPos = chairsMd[idx];
              const occupied = occupiedSeatIds?.has(s.id) ?? false;
              const guestId = seatGuestMap?.get(s.id);

              const tooltipContent = (
                <Box>
                  <Typography variant="caption">
                    <strong>Section:</strong> {s.section.name ?? "—"}
                  </Typography>
                  <br />
                  <Typography variant="caption">
                    <strong>Table:</strong> {s.table.name ?? "—"}
                  </Typography>
                  <br />
                  <Typography variant="caption">
                    <strong>Seat:</strong> {seatLabel(s)}
                  </Typography>

                  {s.guestId && (
                    <>
                      <br />
                      <Typography variant="caption">
                        Gast: {fullName(s)}
                      </Typography>
                    </>
                  )}

                  {s.invitationId && (
                    <>
                      <br />
                      <Typography variant="caption">
                        Einladung: {fullName(s)}
                      </Typography>
                    </>
                  )}

                  <br />
                  <Typography variant="caption">
                    <strong>Status:</strong> {occupied ? "belegt" : "frei"}
                  </Typography>
                  {s.note && (
                    <>
                      <br />
                      <Typography variant="caption">
                        <strong>Notiz:</strong> {s.note}
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
                <Tooltip
                  key={s.id}
                  arrow
                  placement="top"
                  title={tooltipContent}
                >
                  <Avatar
                    onClick={() => onSeatClick?.(s)}
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
                      guestId || s.invitationId
                        ? "Zum Gastprofil wechseln"
                        : "Sitz ohne Gastzuordnung"
                    }
                    role={guestId || s.invitationId ? "button" : undefined}
                  >
                    {seatLabel(s)}
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

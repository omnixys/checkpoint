"use client";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { Box, Button, Drawer, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import type { ScanResult } from "@/checkpoint/types/scan.type";

type ResultTone = "success" | "error" | "warning";

interface Props {
  guestLoading: boolean;
  onNextScan: () => void;
  result: ScanResult;
  seatLoading: boolean;
}

function getTone(status: ScanResult["status"]): ResultTone {
  if (status === "SUCCESS") return "success";
  return status === "WARNING" ? "warning" : "error";
}

export default function ScanResultCard({ guestLoading, onNextScan, result, seatLoading }: Props) {
  const theme = useTheme();
  const tScanner = useTypedTranslations("scanner");
  const tTicket = useTypedTranslations("ticket");
  const tone = getTone(result.status);
  const color = theme.palette[tone].main;
  const guestName = result.guest?.personalInfo
    ? `${result.guest.personalInfo.firstName} ${result.guest.personalInfo.lastName}`
    : null;
  const seats = [
    result.seat?.section?.name
      ? { label: tTicket("section"), value: result.seat.section.name }
      : null,
    result.seat?.table?.name ? { label: tTicket("table"), value: result.seat.table.name } : null,
    result.seat?.number ? { label: tTicket("seat"), value: String(result.seat.number) } : null,
  ].filter((value): value is { label: string; value: string } => value !== null);
  const loadingDetails = result.status === "SUCCESS" && (guestLoading || seatLoading);
  const statusLabel =
    result.status === "SUCCESS"
      ? tScanner("sheet.accepted")
      : result.status === "WARNING"
        ? tScanner("sheet.attention")
        : tScanner("sheet.notAccepted");

  return (
    <Drawer
      anchor="bottom"
      open={true}
      sx={{ zIndex: 12_000_001 }}
      slotProps={{
        backdrop: { sx: { backgroundColor: alpha(theme.palette.common.black, 0.18) } },
        paper: {
          sx: {
            width: "100%",
            maxWidth: theme.spacing(64),
            mx: "auto",
            px: { xs: 2, sm: 3 },
            pt: 2,
            pb: "max(env(safe-area-inset-bottom), 16px)",
            borderTopLeftRadius: theme.shape.borderRadius,
            borderTopRightRadius: theme.shape.borderRadius,
            border: 1,
            borderColor: alpha(color, 0.36),
            backgroundColor: theme.palette.background.paper,
            boxShadow: `0 -${theme.spacing(1)} ${theme.spacing(5)} ${alpha(theme.palette.common.black, 0.2)}`,
          },
        },
      }}
    >
      <Stack spacing={2} sx={{ minWidth: 0 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start", minWidth: 0 }}>
          <Box
            sx={{
              width: theme.spacing(5.5),
              height: theme.spacing(5.5),
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              color,
              backgroundColor: alpha(color, 0.14),
            }}
          >
            {tone === "success" ? (
              <CheckCircleRoundedIcon />
            ) : tone === "warning" ? (
              <InfoRoundedIcon />
            ) : (
              <ErrorRoundedIcon />
            )}
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle1" sx={{ color, fontWeight: 700, lineHeight: 1.2 }}>
              {statusLabel}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.primary, mt: 0.5, overflowWrap: "anywhere" }}
            >
              {result.message}
            </Typography>
          </Box>
        </Stack>

        {result.status === "SUCCESS" ? (
          <Box
            sx={{
              p: 1.5,
              borderRadius: theme.shape.borderRadius,
              backgroundColor: theme.palette.extended.surface.level3,
            }}
          >
            {loadingDetails ? (
              <Stack spacing={1} aria-live="polite">
                <Skeleton width="58%" />
                <Skeleton width="82%" />
              </Stack>
            ) : (
              <Stack spacing={1.25}>
                {guestName ? (
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0 }}>
                    <PersonRoundedIcon
                      aria-hidden="true"
                      sx={{ color: theme.palette.text.secondary, flexShrink: 0 }}
                    />
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      {tTicket("guest")}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, minWidth: 0, overflowWrap: "anywhere" }}
                    >
                      {guestName}
                    </Typography>
                  </Stack>
                ) : null}
                {seats.map((seat) => (
                  <Stack
                    direction="row"
                    key={seat.label}
                    spacing={2}
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      {seat.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, textAlign: "right", overflowWrap: "anywhere" }}
                    >
                      {seat.value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </Box>
        ) : null}

        <Button
          fullWidth
          variant="contained"
          onClick={onNextScan}
          sx={{ minHeight: theme.spacing(6) }}
        >
          {tScanner("nextScan")}
        </Button>
      </Stack>
    </Drawer>
  );
}

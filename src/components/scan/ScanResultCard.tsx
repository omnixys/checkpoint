"use client";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import WeekendRoundedIcon from "@mui/icons-material/WeekendRounded";
import { Box, Chip, Divider, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import type { ScanResult } from "@/checkpoint/types/scan.type";
import { Fragment } from "react/jsx-runtime";
import { useDevice } from "@/checkpoint/providers/DeviceProvider";

type ResultTone = "success" | "error" | "warning";

function getResultTone(status: ScanResult["status"]): ResultTone {
  if (status === "SUCCESS") {
    return "success";
  }

  if (status === "ERROR") {
    return "error";
  }

  return "warning";
}

function formatDateTime(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function ScanResultCard({ result }: { result: ScanResult }) {
  const theme = useTheme();
  const locale = useLocale();
  const { isMobile} = useDevice();
  const tTicket = useTypedTranslations("ticket");

  const tone = getResultTone(result.status);
  const color =
    tone === "success"
      ? theme.palette.success.main
      : tone === "error"
        ? theme.palette.error.main
        : theme.palette.warning.main;

  const statusLabel =
    result.status === "SUCCESS"
      ? tTicket("scanStatus.success")
      : result.status === "ERROR"
        ? tTicket("scanStatus.error")
        : tTicket("scanStatus.warning");

  const reasonLabel = (() => {
    switch (result.reason) {
      case "OK":
        return tTicket("reason.ok");
      case "TICKET_REVOKED":
        return tTicket("reason.ticketRevoked");
      case "WRONG_EVENT":
        return tTicket("reason.wrongEvent");
      case "ALREADY_INSIDE":
        return tTicket("reason.alreadyInside");
      case "DEVICE_MISMATCH":
        return tTicket("reason.deviceMismatch");
      case "INVALID_QR":
        return tTicket("reason.invalidQr");
      default:
        return null;
    }
  })();

  const guestName = result.guest?.personalInfo
    ? `${result.guest.personalInfo.firstName} ${result.guest.personalInfo.lastName}`
    : null;

  // TODO SeatSegment mit tTicket with seats
  // const seatParts = [
  //   result.seat?.section.name,
  //   result.seat?.table?.name ? tTicket("tableWithName", { name: result.seat.table.name }) : null,
  //   result.seat?.label ? tTicket("seatLabelWithValue", { label: result.seat.label }) : null,
  //   result.seat?.number ? tTicket("seatNumberWithValue", { number: result.seat.number }) : null,
  // ].filter(Boolean);

type SeatSegment = {
  label: string;
  value: string;
};

const seatSegments: SeatSegment[] = [
  result.seat?.section?.name
    ? { label: tTicket("section"), value: result.seat.section.name }
    : null,

  result.seat?.table?.name
    ? { label: tTicket("table"), value: result.seat.table.name }
    : null,

  // result.seat?.label
  //   ? { label: tTicket("seat"), value: result.seat.label }
  //   : null,

  result.seat?.number
    ? { label: "#", value: String(result.seat.number) }
    : null,
].filter((v): v is SeatSegment => v !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 170, damping: 20 }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 4,
          border: 1,
          borderColor: alpha(color, 0.36),
          minWidth: 0,
          background: `linear-gradient(145deg, ${alpha(
            theme.palette.background.paper,
            0.76,
          )}, ${alpha(theme.palette.background.default, 0.62)})`,
          backdropFilter: "blur(24px) saturate(150%)",
          WebkitBackdropFilter: "blur(24px) saturate(150%)",
          boxShadow: `0 ${theme.spacing(2)} ${theme.spacing(7)} ${alpha(color, 0.18)}`,
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ alignItems: { xs: "flex-start", sm: "center" } }}
          >
            <Box
              sx={{
                width: theme.spacing(5.5),
                height: theme.spacing(5.5),
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                color,
                backgroundColor: alpha(color, 0.12),
                boxShadow: `inset 0 0 ${theme.spacing(2)} ${alpha(color, 0.16)}`,
                flexShrink: 0,
              }}
            >
              {tone === "success" ? (
                <CheckCircleRoundedIcon
                  sx={{ width: theme.spacing(3), height: theme.spacing(3) }}
                />
              ) : tone === "error" ? (
                <ErrorRoundedIcon
                  sx={{ width: theme.spacing(3), height: theme.spacing(3) }}
                />
              ) : (
                <InfoRoundedIcon
                  sx={{ width: theme.spacing(3), height: theme.spacing(3) }}
                />
              )}
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Chip
                label={statusLabel}
                sx={{
                  height: theme.spacing(3),
                  color,
                  fontWeight: 800,
                  backgroundColor: alpha(color, 0.12),
                  border: 1,
                  borderColor: alpha(color, 0.26),
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 800,
                  lineHeight: 1.18,
                  mt: 1,
                  overflowWrap: "anywhere",
                }}
              >
                {result.message}
              </Typography>
            </Box>
          </Stack>

          {reasonLabel && result.reason !== "OK" ? (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                color,
                backgroundColor: alpha(color, 0.1),
                border: 1,
                borderColor: alpha(color, 0.2),
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {result.valid ? tTicket("hint") : tTicket("reasonLabel")}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary, mt: 0.25 }}
              >
                {reasonLabel}
              </Typography>
            </Box>
          ) : null}

          {result.status === "SUCCESS" &&
          (guestName || seatSegments.length > 0) ? (
            <>
              <Divider
                sx={{ borderColor: alpha(theme.palette.divider, 0.72) }}
              />

              <Stack spacing={1.25}>
                {guestName ? (
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.25}
                    sx={{ alignItems: { xs: "flex-start", sm: "center" } }}
                  >
                    <PersonRoundedIcon
                      sx={{
                        width: theme.spacing(2.4),
                        height: theme.spacing(2.4),
                        color: theme.palette.text.secondary,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {tTicket("guest")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {guestName}
                    </Typography>
                  </Stack>
                ) : null}

                {isMobile ? (
                  <Stack spacing={1}>
                      {seatSegments.map((seg, index) => {
                        const isLast = index === seatSegments.length - 1;
                        return (
                          <Box
                            key={index}
                            sx={{
                              px: 1.5,
                              py: 1,
                              borderRadius: 3,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",

                              background: isLast
                                ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.25)}, ${alpha(
                                  theme.palette.success.main,
                                  0.1,
                                )})`
                                : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(
                                  theme.palette.background.paper,
                                  0.4,
                                )})`,

                              border: `1px solid ${isLast
                                ? alpha(theme.palette.success.main, 0.4)
                                : alpha(theme.palette.primary.main, 0.25)
                                }`,

                              backdropFilter: "blur(12px)",
                            }}
                          >
                            {/* Label */}
                            <Typography
                              variant="caption"
                              sx={{
                                color: theme.palette.text.secondary,
                                fontWeight: 600,
                              }}
                            >
                              {seg.label}
                            </Typography>

                            {/* Value */}
                            <Typography
                              sx={{
                                fontWeight: 900,
                                fontSize: "0.95rem",
                                letterSpacing: 0.3,
                                maxWidth: "60%",
                                textAlign: "right",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {seg.value}
                            </Typography>
                          </Box>
                        );
                      })}
                  </Stack>
                ) : (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ gap: 1, flexWrap: "wrap", alignItems: "center" }}
                  >
                    {seatSegments.map((seg, index) => (
                      <Fragment key={index}>
                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.6,
                            borderRadius: 999,
                            background: `linear-gradient(135deg, ${alpha(
                              theme.palette.primary.main,
                              0.18,
                            )}, ${alpha(theme.palette.secondary.main, 0.12)})`,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                            backdropFilter: "blur(10px)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 800 }}
                          >
                            {seg.value}
                          </Typography>
                        </Box>

                        {index < seatSegments.length - 1 && (
                          <Typography
                            variant="caption"
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            →
                          </Typography>
                        )}
                      </Fragment>
                    ))}
                  </Stack>
                )}
              </Stack>
            </>
          ) : null}

          {result.ticket ? (
            <>
              <Divider
                sx={{ borderColor: alpha(theme.palette.divider, 0.72) }}
              />
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary }}
              >
                {tTicket("ticketState", {
                  status: result.ticket.revoked
                    ? tTicket("status.revoked")
                    : tTicket("status.valid"),
                })}
              </Typography>
            </>
          ) : null}

          {result.status === "ERROR" && result.device ? (
            <>
              <Divider
                sx={{ borderColor: alpha(theme.palette.divider, 0.72) }}
              />
              <Stack spacing={0.75}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {tTicket("deviceBinding")}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.secondary, overflowWrap: "anywhere" }}
                >
                  {tTicket("deviceHash", { hash: result.device.hash })}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {tTicket("deviceActivated", {
                    date: formatDateTime(result.device.activatedAt, locale),
                  })}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {tTicket("deviceIp", { ip: result.device.activationIP })}
                </Typography>
                {result.deviceMatched ? null : (
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.error.main }}
                  >
                    {tTicket("reason.deviceMismatch")}
                  </Typography>
                )}
              </Stack>
            </>
          ) : null}
        </Stack>
      </Box>
    </motion.div>
  );
}

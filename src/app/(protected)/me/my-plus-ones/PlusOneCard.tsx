"use client";

import { PlusOneItem } from "@/checkpoint/app/(protected)/me/my-plus-ones/types/plusOne.types";
import { formatEnum } from "@/checkpoint/i18n/format-enum";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import EventSeatRoundedIcon from "@mui/icons-material/EventSeatRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import { alpha, Box, Chip, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

type Props = {
  plusOne: PlusOneItem;
  index: number;
  onEdit: (plusOne: PlusOneItem) => void;
  onDelete: (id: string) => Promise<void>;
};

const MotionBox = motion.create(Box);

export default function PlusOneCard({ plusOne, index, onEdit, onDelete }: Props) {
  const theme = useTheme();
  const t = useTypedTranslations("invitation");

  const fullName = `${plusOne.firstName} ${plusOne.lastName}`.trim();

  const primaryPhone =
    plusOne.phoneNumbers.find((phone) => phone.isPrimary) ?? plusOne.phoneNumbers[0];

  const statusLabel = plusOne.status
    ? formatEnum(t, "plusOnes.status", plusOne.status)
    : t("plusOnes.status.UNKNOWN");

  const statusIcon =
    plusOne.status === "ACCEPTED" || plusOne.status === "APPROVED" ? (
      <CheckCircleRoundedIcon fontSize="small" />
    ) : plusOne.status === "PENDING" ? (
      <HourglassEmptyRoundedIcon fontSize="small" />
    ) : (
      <BlockRoundedIcon fontSize="small" />
    );

  return (
    <MotionBox
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.22,
        delay: index * 0.04,
      }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      layout
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(28,28,30,0.92) 0%, rgba(18,18,18,0.88) 100%)"
            : "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,248,252,0.96) 100%)",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 22px 52px rgba(0,0,0,0.35)"
            : "0 20px 46px rgba(0,0,0,0.08)",
        p: 2,
      }}
    >
      <Stack spacing={1.75}>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Stack
            direction="row"
            spacing={1.25}
            sx={{
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: alpha(theme.palette.primary.main, 0.14),
                color: theme.palette.primary.main,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
              }}
            >
              <PersonRoundedIcon />
            </Box>

            <Stack spacing={0.35}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                }}
              >
                {fullName}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                sx={{
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  size="small"
                  icon={statusIcon}
                  label={statusLabel}
                  sx={{
                    borderRadius: 999,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.text.primary,
                  }}
                />

                {/* <InvitationStatusChip
                  status={plusOne.status as InvitationStatus}
                  rsvp={undefined}
                /> */}

                {plusOne.seat?.label ? (
                  <Chip
                    size="small"
                    icon={<EventSeatRoundedIcon />}
                    label={`${t("plusOnes.seat")}: ${plusOne.seat.label}`}
                    sx={{
                      borderRadius: 999,
                      backgroundColor: alpha(theme.palette.success.main, 0.12),
                      color: theme.palette.text.primary,
                    }}
                  />
                ) : null}
              </Stack>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={0.5}>
            <Tooltip title={t("plusOnes.actions.edit")}>
              <IconButton onClick={() => onEdit(plusOne)}>
                <EditRoundedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={t("plusOnes.actions.delete")}>
              <IconButton onClick={() => void onDelete(plusOne.id)}>
                <DeleteRoundedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {(plusOne.email || primaryPhone || plusOne.phoneNumber) && (
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {plusOne.email ? (
              <Chip
                size="small"
                icon={<EmailRoundedIcon />}
                label={plusOne.email}
                variant="outlined"
              />
            ) : null}

            {primaryPhone ? (
              <Chip
                size="small"
                icon={<PhoneIphoneRoundedIcon />}
                label={`${primaryPhone.countryCode} ${primaryPhone.number}`}
                variant="outlined"
              />
            ) : plusOne.phoneNumber ? (
              <Chip
                size="small"
                icon={<PhoneIphoneRoundedIcon />}
                label={plusOne.phoneNumber}
                variant="outlined"
              />
            ) : null}
          </Stack>
        )}
      </Stack>
    </MotionBox>
  );
}

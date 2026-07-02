"use client";

import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { EventHeaderProps } from "../EventActions";
import { CoverMediaType } from "@/checkpoint/types/event.type";

export function getBestImage(media: CoverMediaType, targetWidth: number): string | null {
  if (!media) return null;

  if (!media.variants?.length) return media.url;

  const sorted = [...media.variants].sort((a, b) => a.width - b.width);

  const match = sorted.find((v) => v.width >= targetWidth);

  const last = sorted[sorted.length - 1];

  return match?.url ?? last?.url ?? media.url;
}

export default function EventHeaderB({ eventPageData }: EventHeaderProps) {
  const t = useTypedTranslations("event");
  const tCommon = useTypedTranslations("common");

  const theme = useTheme();

  const roleChipColor =
    eventPageData?.myRole === "ADMIN"
      ? "primary"
      : eventPageData?.myRole === "SECURITY"
        ? "success"
        : "default";

  const hero = getBestImage(eventPageData.coverMedia, 1200) || "/event/event-default.png";

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 5,
        overflow: "hidden",
        height: { xs: 220, sm: 260, md: 300 },
      }}
    >
      <Image src={hero} alt={eventPageData.name} fill style={{ objectFit: "cover" }} />

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to top, ${theme.palette.background.paper} 8%, transparent 60%)`,
        }}
      />

      <Stack
        spacing={1}
        sx={{
          position: "absolute",
          right: { xs: 16, sm: "auto" },
          bottom: { xs: 16, sm: 24 },
          left: { xs: 16, sm: 24 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: theme.palette.primary.contrastText,
            overflowWrap: "anywhere",
          }}
        >
          {eventPageData.name}
        </Typography>

        <Chip
          label={
            eventPageData.myRole ? t(`header.role.${eventPageData.myRole}`) : t("header.role.GUEST")
          }
          color={roleChipColor}
          variant={eventPageData.myRole === "GUEST" ? "outlined" : "filled"}
          sx={{
            width: "fit-content",
            backdropFilter: "blur(8px)",
            fontWeight: 600,
          }}
        />

        {eventPageData.settings?.startsAt && (
          <Typography variant="body1" sx={{ color: theme.palette.primary.contrastText }}>
            {new Date(eventPageData.settings.startsAt).toLocaleString("de-DE", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </Typography>
        )}

        {eventPageData.settings?.endsAt && (
          <Typography variant="body2" sx={{ color: theme.palette.primary.contrastText }}>
            bis{" "}
            {new Date(eventPageData.settings.endsAt).toLocaleString("de-DE", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

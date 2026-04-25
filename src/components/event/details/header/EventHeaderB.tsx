"use client";

import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { EventHeaderProps } from "../EventActions";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

type MediaVariant = {
  width: number;
  url: string;
};

type Media = {
  url: string;
  filename: string;
  variants?: MediaVariant[];
};

function getBestImage(
  media: Media | null | undefined,
  targetWidth: number,
): string | null {
  if (!media) return null;

  if (!media.variants?.length) return media.filename;

  const sorted = [...media.variants].sort((a, b) => a.width - b.width);

  const match = sorted.find((v) => v.width >= targetWidth);

  const last = sorted[sorted.length - 1];

  return match?.url ?? last?.url ?? media.filename;
}

export default function EventHeaderB({ ev }: EventHeaderProps) {
  const t = useTypedTranslations("event");
  const tCommon = useTypedTranslations("common");

  
  const theme = useTheme();

  const roleChipColor =
    ev.myRole === "ADMIN" ? "primary" : ev.myRole === "SECURITY" ? "success" : "default";

  const hero = getBestImage(ev.logoMedia, 1200) || "/event/event-default.png";

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 5,
        overflow: "hidden",
        height: { xs: 220, sm: 260, md: 300 },
      }}
    >
      <Image src={hero} alt={ev.name} fill style={{ objectFit: "cover" }} />

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
          bottom: 24,
          left: 24,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: theme.palette.primary.contrastText }}
        >
          {ev.name}
        </Typography>

        <Chip
          label={ev.myRole ? t(`header.role.${ev.myRole}`) : t("header.role.GUEST")}
          color={roleChipColor}
          variant={ev.myRole === "GUEST" ? "outlined" : "filled"}
          sx={{
            width: "fit-content",
            backdropFilter: "blur(8px)",
            fontWeight: 600,
          }}
        />

        <Typography
          variant="body1"
          sx={{ color: theme.palette.primary.contrastText }}
        >
          {new Date(ev.settings.startsAt).toLocaleString("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: theme.palette.primary.contrastText }}
        >
          bis{" "}
          {new Date(ev.settings.endsAt).toLocaleString("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </Typography>
      </Stack>
    </Box>
  );
}

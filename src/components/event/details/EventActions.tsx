"use client";

import { EventFullFragment } from "@/checkpoint/generated/graphql";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { env } from "@/checkpoint/lib/env";
import { getLogger } from "@/checkpoint/utils/logger";
import { Button, Stack } from "@mui/material";
import Link from "next/link";

export type EventHeaderProps = {
  ev: EventFullFragment;
};

const basePath = env.CHECKPOINT_BASE_PATH;

export default function EventActions({ ev }: EventHeaderProps) {
  const t = useTypedTranslations("event");
  
  const logger = getLogger("EventActions");
  logger.debug({ ev });
  return (
    <Stack
      spacing={1.5}
      sx={{
        mt: 10,
      }}
    >
      <Button
        fullWidth
        variant="contained"
        component={Link}
        //href={`${basePath}event/${ev.id}/description`}
        href={"https://cgr.omnixys.com"}
        sx={{ borderRadius: 3, fontWeight: 600 }}
      >
        {t("actions.description")}
      </Button>
      {/* Guest */}
      {ev.myRole === "GUEST" && (
        <>
          <Button
            fullWidth
            variant="contained"
            component={Link}
            href={`${basePath}my-qr?eventId=${ev.id}`}
            sx={{ borderRadius: 3, fontWeight: 600 }}
          >
            {t("actions.myTicket")}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href={`${basePath}my-seat?eventId=${ev.id}`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.mySeat")}
          </Button>
        </>
      )}

      {/* Security */}
      {ev.myRole === "SECURITY" && (
        <>
          <Button
            fullWidth
            variant="contained"
            component={Link}
            href={`${basePath}scan?eventId=${ev.id}`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.scanner")}
          </Button>

          <Button
            component={Link}
            href={`${basePath}event/${ev.id}/scans`}
            fullWidth
            variant="outlined"
            sx={{ borderRadius: 3 }}
          >
            {t("actions.scanLogs")}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href={`${basePath}event/${ev.id}/guest`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.guestList")}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href={`${basePath}event/${ev.id}/seat`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.seats")}
          </Button>
        </>
      )}

      {/* Admin */}
      {ev.myRole === "ADMIN" && (
        <>
          <Button
            fullWidth
            variant="contained"
            component={Link}
            href={`${basePath}event/${ev.id}/invitation`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.manageInvitations")}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href={`${basePath}event/${ev.id}/seat`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.manageSeats")}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href={`${basePath}event/${ev.id}/ticket`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.manageTickets")}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href={`${basePath}event/${ev.id}/security`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.securityDashboard")}
          </Button>

          <Button
            component={Link}
            href={`${basePath}event/${ev.id}/scans`}
            fullWidth
            variant="outlined"
            sx={{ borderRadius: 3 }}
            disabled
          >
            {t("actions.scanLogs")}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href={`${basePath}event/${ev.id}/guest`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.guestList")}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href={`${basePath}event/${ev.id}/settings`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.settings")}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href={`${basePath}event/${ev.id}/notification`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.notifications")}
          </Button>
        </>
      )}
    </Stack>
  );
}

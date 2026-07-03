"use client";

import { Button, Stack } from "@mui/material";
import Link from "next/link";
import type { EventPageQuery } from "@/checkpoint/generated/graphql";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { env } from "@/checkpoint/lib/env";
import type { Safe } from "@/checkpoint/types/core/core.type";
import { getLogger } from "@/checkpoint/utils/logger";

export interface EventHeaderProps {
  eventPageData: Safe<EventPageQuery["event"]>;
}

const basePath = env.CHECKPOINT_BASE_PATH;

export default function EventActions({ eventPageData }: EventHeaderProps) {
  const t = useTypedTranslations("event");

  const logger = getLogger("EventActions");
  logger.debug({ ev: eventPageData });
  return (
    <Stack
      spacing={1.5}
      sx={{
        mt: 10,
      }}
    >
      <Button
        fullWidth={true}
        variant="contained"
        component={Link}
        //href={`${basePath}event/${ev.id}/description`}
        href="https://cgr.omnixys.com"
        sx={{ borderRadius: 3, fontWeight: 600 }}
      >
        {t("actions.description")}
      </Button>
      {/* Guest */}
      {eventPageData?.myRole === "GUEST" && (
        <>
          <Button
            fullWidth={true}
            variant="contained"
            component={Link}
            href={`${basePath}me/my-qr?eventId=${eventPageData.id}`}
            sx={{ borderRadius: 3, fontWeight: 600 }}
          >
            {t("actions.myTicket")}
          </Button>

          <Button
            fullWidth={true}
            variant="outlined"
            component={Link}
            href={`${basePath}me/my-seat?eventId=${eventPageData.id}`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.mySeat")}
          </Button>
        </>
      )}

      {/* Security */}
      {eventPageData?.myRole === "SECURITY" && (
        <>
          <Button
            fullWidth={true}
            variant="contained"
            component={Link}
            href={`${basePath}scan?eventId=${eventPageData.id}`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.scanner")}
          </Button>

          <Button
            component={Link}
            href={`${basePath}event/${eventPageData.id}/scans`}
            fullWidth={true}
            variant="outlined"
            sx={{ borderRadius: 3 }}
          >
            {t("actions.scanLogs")}
          </Button>

          <Button
            fullWidth={true}
            variant="outlined"
            component={Link}
            href={`${basePath}event/${eventPageData.id}/guest`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.guestList")}
          </Button>

          <Button
            fullWidth={true}
            variant="outlined"
            component={Link}
            href={`${basePath}event/${eventPageData.id}/seat`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.seats")}
          </Button>
        </>
      )}

      {/* Admin */}
      {eventPageData?.myRole === "ADMIN" && (
        <>
          <Button
            fullWidth={true}
            variant="contained"
            component={Link}
            href={`${basePath}event/${eventPageData.id}/invitation`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.manageInvitations")}
          </Button>

          <Button
            fullWidth={true}
            variant="outlined"
            component={Link}
            href={`${basePath}event/${eventPageData.id}/seat`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.manageSeats")}
          </Button>

          <Button
            fullWidth={true}
            variant="outlined"
            component={Link}
            href={`${basePath}event/${eventPageData.id}/ticket`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.manageTickets")}
          </Button>

          <Button
            fullWidth={true}
            variant="outlined"
            component={Link}
            href={`${basePath}event/${eventPageData.id}/security`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.securityDashboard")}
          </Button>

          <Button
            component={Link}
            href={`${basePath}event/${eventPageData.id}/scans`}
            fullWidth={true}
            variant="outlined"
            sx={{ borderRadius: 3 }}
            disabled={true}
          >
            {t("actions.scanLogs")}
          </Button>

          <Button
            fullWidth={true}
            variant="outlined"
            component={Link}
            href={`${basePath}event/${eventPageData.id}/guest`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.guestList")}
          </Button>

          <Button
            fullWidth={true}
            variant="outlined"
            component={Link}
            href={`${basePath}event/${eventPageData.id}/settings`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.settings")}
          </Button>

          <Button
            fullWidth={true}
            variant="outlined"
            component={Link}
            href={`${basePath}event/${eventPageData.id}/notification`}
            sx={{ borderRadius: 3 }}
          >
            {t("actions.notifications")}
          </Button>
        </>
      )}
    </Stack>
  );
}

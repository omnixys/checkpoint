"use client";

import { Box, CircularProgress, Stack } from "@mui/material";
import { useParams } from "next/navigation";
import EventAddressSection from "@/checkpoint/components/event/settings/address/EventAddressSection";
import EventSettingsLayout from "@/checkpoint/components/event/settings/EventSettingsLayout";
import EventGuestReminderSection from "@/checkpoint/components/event/settings/sections/EventGuestReminderSection";
import EventMetaSection from "@/checkpoint/components/event/settings/sections/EventMetaSection";
import EventSettingsSection from "@/checkpoint/components/event/settings/sections/EventSettingsSection";
import EventTabsVisibilitySection from "@/checkpoint/components/event/settings/sections/EventTabsVisibilitySection";
import RolesSection from "@/checkpoint/components/event/settings/sections/RolesSection";
import SeatColorGroupSection from "@/checkpoint/components/event/settings/sections/SeatColorGroupSection";
import TimelineSection from "@/checkpoint/components/event/settings/sections/TimelineSection";
import RouteGuard from "@/checkpoint/components/guard/RouteGuard";
import { useEventSettings } from "@/checkpoint/hooks/events/useEventSettings";

export const centerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
};
/**
 * Root Page
 *
 * Responsibilities:
 * - Fetch data via hook
 * - Compose sections
 * - Provide clean layout
 */
export default function EventSettingsClientPage() {
  const { id } = useParams<{ id: string }>();
  const { meta, settings, timeline, roles, actions, loading, error } = useEventSettings(id);

  const isReady = meta && settings && roles;

  /**
   * CRITICAL:
   * Never pass undefined into strict components
   */
  if (loading && !isReady) {
    return (
      <Box sx={centerStyle}>
        <CircularProgress />
      </Box>
    );
  }

  // TODO visuell optimieren
  if (error) {
    return <Box>Error loading event settings</Box>;
  }

  if (!isReady) {
    return <Box>Event data incomplete</Box>;
  }

  return (
    <RouteGuard featureId="settings">
      <Stack spacing={2}>
        <EventSettingsLayout
          sections={{
            meta: <EventMetaSection meta={meta} actions={actions} roles={roles} />,
            settings: <EventSettingsSection settings={settings} actions={actions} />,
            timeline: (
              <TimelineSection eventName={meta.name} timeline={timeline ?? []} actions={actions} />
            ),
            roles: <RolesSection roles={roles} meta={{ id: meta.id, owner: meta.owner }} />,
            tabs: <EventTabsVisibilitySection settings={settings} actions={actions} />,
            seatColors: (
              <SeatColorGroupSection
                settings={{
                  seatColorGroups: settings.seatColorGroups,
                  invitedByOptions: settings.invitedByOptions,
                }}
                actions={actions}
              />
            ),
            address: <EventAddressSection eventId={meta.id} />,
            reminder: <EventGuestReminderSection settings={settings} actions={actions} />,
          }}
        />
      </Stack>
    </RouteGuard>
  );
}

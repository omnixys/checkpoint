"use client";

import { Box, Stack } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import DashboardGrid from "@/checkpoint/components/dashboard/DashboardGrid";
import EventActions from "@/checkpoint/components/event/details/EventActions";
import EventHeaderFactory from "@/checkpoint/components/event/details/EventHeaderFactory";
import EventTabs from "@/checkpoint/components/event/details/EventTabs";
import EventVariantToggle from "@/checkpoint/components/event/details/EventVariantToggle";
import EventTabContent from "@/checkpoint/components/event/EventTabContent";
import RouteGuard from "@/checkpoint/components/guard/RouteGuard";
import { useEventPage } from "@/checkpoint/hooks/events/useEventPage";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";

export default function EventPage() {
  const tCommon = useTypedTranslations("common");
  const tErrors = useTypedTranslations("error");

  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { activeEventId, selectEvent } = useActiveEvent();

  useEffect(() => {
    if (id && id !== activeEventId) {
      selectEvent(id);
    }
  }, [activeEventId, id, selectEvent]);

  const {
    activeTab,
    changeTab,
    variant,
    changeVariant,
    handleDescriptionChange,

    eventPage,
    eventPageLoading,
    eventPageError,
  } = useEventPage({
    eventId: id,
    isAuthenticated,
  });

  // TODO statt text ein skeleton oder loader
  if (eventPageLoading) {
    return <div>{tCommon("loading")}</div>;
  }

  // TODO statt text etwas bessere
  if ((eventPageError || !eventPage) && (eventPageError || !eventPage)) {
    return <div>{tErrors("eventNotFound")}</div>;
  }

  return (
    <RouteGuard featureId="event-dashboard">
      <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <Stack spacing={3} sx={{ pb: 5 }}>
          {/* Header Variant Toggle */}
          <EventVariantToggle variant={variant} onChange={changeVariant} />

          {/* Dynamic Header */}
          <EventHeaderFactory ev={eventPage} variant={variant} />

          {/* Tabs */}
          <EventTabs
            active={activeTab}
            onChange={changeTab}
            visibleTabs={eventPage.settings?.visibleTabs ?? null}
          />

          {/* Content */}
          <EventTabContent
            ev={eventPage}
            active={activeTab}
            onDescriptionChange={handleDescriptionChange}
          />

          {/* Dashboard Widgets */}
          <DashboardGrid />
        </Stack>

        {/* Actions */}
        <EventActions eventPageData={eventPage} />
      </Box>
    </RouteGuard>
  );
}

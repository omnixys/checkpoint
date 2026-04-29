"use client";

import { Box, Stack } from "@mui/material";
import { useParams } from "next/navigation";

import EventActions from "@/checkpoint/components/event/details/EventActions";
import EventHeaderFactory from "@/checkpoint/components/event/details/EventHeaderFactory";
import EventTabs from "@/checkpoint/components/event/details/EventTabs";
import EventVariantToggle from "@/checkpoint/components/event/details/EventVariantToggle";
import EventTabContent from "@/checkpoint/components/event/EventTabContent";
import { useEventPage } from "@/checkpoint/hooks/events/useEventPage";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { useAuth } from "@/checkpoint/providers/AuthProvider";

export default function EventPage() {
  const tCommon = useTypedTranslations("common");
  const tErrors = useTypedTranslations("error");

  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

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

  /**
   * AFTER hooks → conditional rendering
   */
  if (!isAuthenticated) return null;
  // TODO statt text ein skeleton oder loader
  if (eventPageLoading) return <div>{tCommon("loading")}</div>;

  // TODO statt text etwas bessere
  if (eventPageError || !eventPage) {
    if (eventPageError || !eventPage) {
      return <div>{tErrors("eventNotFound")}</div>;
    }
  }

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Stack spacing={3} sx={{ pb: 5 }}>
        {/* Header Variant Toggle */}
        <EventVariantToggle variant={variant} onChange={changeVariant} />

        {/* Dynamic Header */}
        <EventHeaderFactory ev={eventPage} variant={variant} />

        {/* Tabs */}
        <EventTabs active={activeTab} onChange={changeTab} />

        {/* Content */}
        <EventTabContent
          ev={eventPage}
          active={activeTab}
          onDescriptionChange={handleDescriptionChange}
        />
      </Stack>

      {/* Actions */}
      <EventActions eventPageData={eventPage} />
    </Box>
  );
}

"use client";

import { Box, Stack } from "@mui/material";
import { useParams } from "next/navigation";

import EventActions from "@/checkpoint/components/event/details/EventActions";
import EventHeaderFactory from "@/checkpoint/components/event/details/EventHeaderFactory";
import EventTabs from "@/checkpoint/components/event/details/EventTabs";
import EventVariantToggle from "@/checkpoint/components/event/details/EventVariantToggle";
import EventTabContent from "@/checkpoint/components/event/EventTabContent";
import { useEventPage } from "@/checkpoint/hooks/events/useEventPage";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { useQuery } from "@apollo/client/react";
import { EventDocument, EventQuery, EventQueryVariables } from "@/checkpoint/generated/graphql";

export default function EventPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  const { data, loading, error } = useQuery<EventQuery, EventQueryVariables>(EventDocument, {
    variables: { id },
    fetchPolicy: "cache-and-network",
    skip: !isAuthenticated,
  });

  const ev = data?.event;

  /**
   * Centralized page logic
   */
  const { activeTab, changeTab, variant, changeVariant, handleDescriptionChange } = useEventPage(
    ev ??
      ({
        id: "",
        timeline: [],
        createdAt: new Date().toISOString(),
      } as any), // später sauber typisieren
  );

  /**
   * AFTER hooks → conditional rendering
   */
  if (!isAuthenticated) return null;

  if (loading) return <div>Loading...</div>;

  if (error || !ev) {
    return <div>Event not found</div>;
  }

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Stack spacing={3} sx={{ pb: 5 }}>
        {/* Header Variant Toggle */}
        <EventVariantToggle variant={variant} onChange={changeVariant} />

        {/* Dynamic Header */}
        <EventHeaderFactory ev={ev} variant={variant} />

        {/* Tabs */}
        <EventTabs active={activeTab} onChange={changeTab} />

        {/* Content */}
        <EventTabContent ev={ev} active={activeTab} onDescriptionChange={handleDescriptionChange} />
      </Stack>

      {/* Actions */}
      <EventActions ev={ev} />
    </Box>
  );
}

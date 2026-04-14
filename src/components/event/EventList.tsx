"use client";

import EmptyEventsCard from "@/checkpoint/components/event/cards/EmptyEventsCard";
import EventCardCompact from "@/checkpoint/components/event/cards/EventCardCompact";
import EventCardPro from "@/checkpoint/components/event/cards/EventCardPro";
import { useEventsQuery } from "@/checkpoint/hooks/events/useEventsQuery";
import { useFilteredEvents } from "@/checkpoint/hooks/events/useFilteredEvents";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import {
  EventsFilter,
  EventListHandle,
  EventViweMode,
  EventVisualOverride,
} from "@/checkpoint/types/event.type";
import { Card, CardContent, Alert, Stack, Skeleton, Grid, Divider } from "@mui/material";
import React from "react";

type Props = {
  toLocal: (dt: string | number | Date) => string;
  search: string;
  filter: EventsFilter;

  viewMode: EventViweMode;
  visualOverride: EventVisualOverride;

  onCountChange: (n: number) => void;
  onLoadingChange: (loading: boolean) => void;
};

export default React.forwardRef<EventListHandle, Props>(function EventList(
  { toLocal, search, filter, viewMode, visualOverride, onCountChange, onLoadingChange },
  ref,
) {
  const { activeEvent, selectEvent } = useActiveEvent();

  const { events, loading, error, refetch } = useEventsQuery();

  const eventsFiltered = useFilteredEvents({
    events,
    search,
    filter,
    activeEventId: activeEvent?.id,
  });

  React.useImperativeHandle(ref, () => ({
    refresh: () => void refetch(),
  }));

  React.useEffect(() => {
    onLoadingChange(loading);
  }, [loading, onLoadingChange]);

  React.useEffect(() => {
    onCountChange(eventsFiltered.length);
  }, [eventsFiltered.length, onCountChange]);

  const initialLoading = loading && !events;

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        {!loading && eventsFiltered.length === 0 && <EmptyEventsCard />}

        {initialLoading && (
          <Stack spacing={1.5}>
            {[1, 2, 3].map((k) => (
              <Card key={k} variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        {viewMode === "list" && (
          <Stack spacing={1.5}>
            {eventsFiltered.map((ev) => (
              <EventCardCompact
                key={ev.id}
                ev={ev}
                isActive={ev.isActive}
                toLocal={toLocal}
                onSetActive={() => selectEvent(ev.id)}
              />
            ))}
          </Stack>
        )}

        {viewMode === "grid" && (
          <Grid container spacing={2}>
            {eventsFiltered.map((ev) => (
              <Grid sx={{ xs: 12, sm: 6, md: 4 }} key={ev.id}>
                <EventCardPro
                  ev={ev}
                  isActive={ev.isActive}
                  toLocal={toLocal}
                  visualOverride={visualOverride}
                  onSetActive={() => selectEvent(ev.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>

      <Divider />
    </Card>
  );
});

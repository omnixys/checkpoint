"use client";

import { useQuery } from "@apollo/client/react";
import {
  Alert,
  Card,
  CardContent,
  Divider,
  Grid,
  Skeleton,
  Stack,
} from "@mui/material";
import React from "react";

import { MyEventsResult } from "@/types/event/event-query-graphql.type";
import { MY_EVENTS } from "@/graphql/event/event-query.graphql";
import { useActiveEvent } from "@/providers/ActiveEventProvider";
import type {
  Event,
  EventListHandle,
  EventsFilter,
} from "@/types/event/event.type";
import EmptyEventsCard from "./cards/EmptyEventsCard";
import EventCardCompact from "./cards/EventCardCompact";
import EventCardPro from "./cards/EventCardPro";

type Props = {
  toLocal: (dt: string | number | Date) => string;
  search: string;
  filter: EventsFilter;

  viewMode: "list" | "grid";
  visualOverride: "auto" | "image" | "banner" | "none";

  onCountChange: (n: number) => void;
  onLoadingChange: (loading: boolean) => void;
};

export default React.forwardRef<EventListHandle, Props>(function EventList(
  {
    toLocal,
    search,
    filter,
    viewMode,
    visualOverride,
    onCountChange,
    onLoadingChange,
  }: Props,
  ref
) {
  const { activeEvent, selectEvent } = useActiveEvent();

  const { data, loading, error, refetch } = useQuery<MyEventsResult>(
    MY_EVENTS,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  React.useImperativeHandle(ref, () => ({
    refresh: () => {
      void refetch();
    },
  }));

  React.useEffect(() => {
    onLoadingChange(loading);
  }, [loading, onLoadingChange]);

  /** FILTER + SEARCH + SORTING */
  const events: (Event & { isActive: boolean })[] = React.useMemo(() => {
    const base = data?.myEvents ?? [];
    const now = Date.now();

    const filtered = base.filter((ev) => {
      const start = new Date(ev.startsAt).getTime();
      const end = new Date(ev.endsAt).getTime();

      if (filter === "upcoming") return start > now;
      if (filter === "now") return start <= now && end >= now;
      if (filter === "past") return end < now;
      return true;
    });

    const searched =
      search.trim().length === 0
        ? filtered
        : filtered.filter((ev) => {
            const q = search.toLowerCase();
            return (
              ev.name.toLowerCase().includes(q) ||
              (ev.id?.toLowerCase().includes(q) ?? false)
            );
          });

    const sorted = [...searched].sort((a, b) => {
      const aStart = new Date(a.startsAt).getTime();
      const bStart = new Date(b.startsAt).getTime();
      return aStart - bStart;
    });

    return sorted.map((ev) => ({
      ...ev,
      isActive: activeEvent?.id === ev.id,
    }));
  }, [data?.myEvents, search, filter, activeEvent?.id]);

  React.useEffect(() => {
    onCountChange(events.length);
  }, [events.length, onCountChange]);

  const initialLoading = loading && !data;

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        {!loading && events.length === 0 && <EmptyEventsCard />}

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

        {/* LIST VIEW */}
        {viewMode === "list" && (
          <Stack spacing={1.5}>
            {events.map((ev) => (
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

        {/* GRID VIEW */}
        {viewMode === "grid" && (
          <Grid container spacing={2}>
            {events.map((ev) => (
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

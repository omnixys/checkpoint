"use client";

import { MyEventsQuery } from "@/checkpoint/generated/graphql";
import { EventsFilter } from "@/checkpoint/types/event.type";
import { useMemo } from "react";

/**
 * Handles ALL business logic:
 * - filtering
 * - searching
 * - sorting
 *
 * This MUST NOT live inside components.
 */
export function useFilteredEvents(params: {
  events: MyEventsQuery["myEvents"];
  search: string;
  filter: EventsFilter;
  activeEventId: string | undefined;
}) {
  const { events, search, filter, activeEventId } = params;

  return useMemo(() => {
    const base = events ?? [];
    const now = Date.now();

    const filtered = base.filter((ev) => {
      const startsAt = ev.settings?.startsAt;
      const endsAt = ev.settings?.endsAt;

      if (!startsAt || !endsAt) {
        return filter === "all";
      }

      const start = new Date(startsAt).getTime();
      const end = new Date(endsAt).getTime();

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
            return ev.name.toLowerCase().includes(q) || (ev.id?.toLowerCase().includes(q) ?? false);
          });

    const sorted = [...searched].sort((a, b) => {
      const aStart = a.settings?.startsAt ? new Date(a.settings.startsAt).getTime() : Infinity;
      const bStart = b.settings?.startsAt ? new Date(b.settings.startsAt).getTime() : Infinity;
      return aStart - bStart;
    });

    return sorted.map((ev) => ({
      ...ev,
      isActive: activeEventId === ev.id,
    }));
  }, [events, search, filter, activeEventId]);
}

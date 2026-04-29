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
  events: MyEventsQuery['myEvents'];
  search: string;
  filter: EventsFilter;
  activeEventId: string | undefined;
}) {
  const { events, search, filter, activeEventId } = params;

  return useMemo(() => {
    const base = events ?? [];
    const now = Date.now();

    const filtered = base.filter((ev) => {
      const start = new Date(ev.settings.startsAt).getTime();
      const end = new Date(ev.settings.endsAt).getTime();

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
      const aStart = new Date(a.settings?.startsAt).getTime();
      const bStart = new Date(b.settings?.startsAt).getTime();
      return aStart - bStart;
    });

    return sorted.map((ev) => ({
      ...ev,
      isActive: activeEventId === ev.id,
    }));
  }, [events, search, filter, activeEventId]);
}

"use client";

import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";
import type {
  EventListHandle,
  EventsFilter,
  EventVisualOverride,
  EventViweMode,
} from "@/checkpoint/types/event.type";

export interface UseEventsPageStateProp {
  listRef: RefObject<EventListHandle | null>;

  search: string;
  setSearch: Dispatch<SetStateAction<string>>;

  filter: EventsFilter;
  setFilter: Dispatch<SetStateAction<EventsFilter>>;

  count: number;
  setCount: Dispatch<SetStateAction<number>>;

  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;

  viewMode: EventViweMode;
  setViewMode: Dispatch<SetStateAction<"list" | "grid">>;

  visualOverride: EventVisualOverride;
  setVisualOverride: Dispatch<SetStateAction<"auto" | "image" | "banner" | "none">>;
  refresh: () => Promise<void>;
}
/**
 * Centralized state management for Events Page.
 *
 * WHY:
 * - Prevents state scattering across components
 * - Ensures consistent behavior
 * - Keeps UI components clean (pure rendering only)
 */
export function useEventsPageState(): UseEventsPageStateProp {
  const listRef = useRef<EventListHandle>(null);

  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<EventsFilter>("all");
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [viewMode, setViewMode] = useState<EventViweMode>("list");

  const [visualOverride, setVisualOverride] = useState<EventVisualOverride>("auto");

  /**
   * Imperative refresh trigger
   */
  const refresh = useCallback(async () => {
    await listRef.current?.refresh();
  }, []);

  return {
    listRef,

    search,
    setSearch,

    filter,
    setFilter,

    count,
    setCount,

    loading,
    setLoading,

    viewMode,
    setViewMode,

    visualOverride,
    setVisualOverride,

    refresh,
  };
}

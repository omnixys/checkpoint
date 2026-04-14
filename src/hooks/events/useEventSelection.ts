// src/checkpoint/hooks/invitation/useEventSelection.ts

"use client";

import { useCallback, useMemo, useState } from "react";

export interface EventSelectionNode {
  id: string;
  name: string;
  parentId?: string | null;
  depth: number;
}

interface UseEventSelectionOptions {
  rootEventId: string;
  children: EventSelectionNode[];
}

/**
 * useEventSelection
 *
 * Encapsulates event tree selection logic for public RSVP:
 * - Root checkbox represents "all child events"
 * - Children can be selected individually or in combination
 * - When all children are selected, root is considered selected
 * - When root is toggled, all children follow
 *
 * This hook intentionally stores the effective event selection as child IDs.
 * Root is a derived UI state, not a separate persisted state.
 */
export function useEventSelection({ rootEventId, children }: UseEventSelectionOptions) {
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);

  const childIds = useMemo(() => children.map((child) => child.id), [children]);

  const isRootSelectable = childIds.length > 0;

  const isRootSelected = useMemo(() => {
    if (!isRootSelectable) {
      return selectedChildIds.length === 0; // root = implicit selection
    }

    return childIds.every((id) => selectedChildIds.includes(id));
  }, [childIds, isRootSelectable, selectedChildIds]);

  const isChildSelected = useCallback(
    (childId: string): boolean => {
      return selectedChildIds.includes(childId);
    },
    [selectedChildIds],
  );

  /**
   * Toggle root selection.
   *
   * If root becomes checked, all children are selected.
   * If root becomes unchecked, all children are cleared.
   */
  const toggleRoot = useCallback(() => {
    setSelectedChildIds((prev) => {
      const allSelected = childIds.every((id) => prev.includes(id));

      if (allSelected) {
        return [];
      }

      return [...childIds];
    });
  }, [childIds]);

  /**
   * Toggle a single child.
   */
  const toggleChild = useCallback((childId: string) => {
    setSelectedChildIds((prev) => {
      if (prev.includes(childId)) {
        return prev.filter((id) => id !== childId);
      }

      return [...prev, childId];
    });
  }, []);

  /**
   * Future-ready payload for API submission.
   *
   * Current backend contract does not yet expose selected event IDs in PublicRsvpInput.
   * This value is therefore prepared here for future integration.
   */
  const selectedEventIds = useMemo(() => {
    return [...selectedChildIds];
  }, [selectedChildIds]);

  /**
   * UI label helper:
   * - If all children selected, treat it like root selection
   * - Otherwise expose the selected children
   */
  const selectedSummary = useMemo(() => {
    if (isRootSelected) {
      return {
        rootEventId,
        selectedChildIds,
        selectedEventIds,
        mode: "root" as const,
      };
    }

    return {
      rootEventId,
      selectedChildIds,
      selectedEventIds,
      mode: "children" as const,
    };
  }, [isRootSelected, rootEventId, selectedChildIds, selectedEventIds]);

  return {
    childIds,
    selectedChildIds,
    selectedEventIds,
    selectedSummary,
    isRootSelectable,
    isRootSelected,
    isChildSelected,
    toggleRoot,
    toggleChild,
  };
}

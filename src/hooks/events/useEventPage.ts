"use client";

import { useEventTabs } from "@/checkpoint/hooks/events/useEventTabs";
import { useEventVariant } from "@/checkpoint/hooks/events/useEventVariant";
import { useCallback, useMemo } from "react";

/**
 * Main orchestration hook for Event Page
 *
 * WHY:
 * - Keeps page 100% UI-only
 * - Centralizes ALL logic
 * - Easier testing + scaling
 */
export function useEventPage(ev: any) {
  const { active, changeTab } = useEventTabs();
  const { variant, changeVariant } = useEventVariant();

  /**
   * Description change handler
   *
   * NOTE:
   * This is where mutation hook will be plugged later
   */
  const handleDescriptionChange = useCallback((value: string) => {
    console.log("Update description:", value);
    // TODO: integrate mutation hook
  }, []);

  /**
   * Memoized data to prevent unnecessary rerenders
   */
  return useMemo(
    () => ({
      activeTab: active,
      changeTab,
      variant,
      changeVariant,
      handleDescriptionChange,
    }),
    [active, changeTab, variant, changeVariant, handleDescriptionChange],
  );
}

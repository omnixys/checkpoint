"use client";

import useEventQuery from "@/checkpoint/hooks/events/useEventQuery";
import { useEventTabs } from "@/checkpoint/hooks/events/useEventTabs";
import { useEventVariant } from "@/checkpoint/hooks/events/useEventVariant";
import { useCallback, useMemo } from "react";

interface Props {
  eventId: string;
  isAuthenticated: boolean;
}

export function useEventPage({ eventId, isAuthenticated }: Props) {
  const { active, changeTab } = useEventTabs();
  const { variant, changeVariant } = useEventVariant();


  const { eventPage, eventPageLoading, eventPageError } = useEventQuery({
    eventId,
    isAuthenticated,
    loadEventPage: true,
  });

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

      eventPage,
      eventPageLoading,
      eventPageError,
    }),
    [active, changeTab, variant, changeVariant, handleDescriptionChange, eventPage, eventPageError, eventPageLoading],
  );
}

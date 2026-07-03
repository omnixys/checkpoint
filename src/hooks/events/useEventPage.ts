"use client";

import { useCallback, useMemo } from "react";
import useEventQuery from "@/checkpoint/hooks/events/useEventQuery";
import { useEventTabs } from "@/checkpoint/hooks/events/useEventTabs";
import { useEventVariant } from "@/checkpoint/hooks/events/useEventVariant";

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
  const handleDescriptionChange = useCallback((_value: string) => {
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
    [
      active,
      changeTab,
      variant,
      changeVariant,
      handleDescriptionChange,
      eventPage,
      eventPageError,
      eventPageLoading,
    ],
  );
}

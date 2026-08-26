"use client";

import EventHeaderA from "@/checkpoint/components/event/details/header/EventHeaderA";
import EventHeaderB from "@/checkpoint/components/event/details/header/EventHeaderB";
import EventHeaderC from "@/checkpoint/components/event/details/header/EventHeaderC";
import EventHeaderD from "@/checkpoint/components/event/details/header/EventHeaderD";
import { UserRoleType } from "@/checkpoint/generated/graphql";
import type { EventVariant } from "@/checkpoint/hooks/events/useEventVariant";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";

/**
 * Factory for rendering event headers.
 *
 * WHY:
 * - Removes conditional logic from pages
 * - Central place for variant control
 * - Scalable for future variants
 */
interface Props {
  ev: any;
  variant: EventVariant;
}

export default function EventHeaderFactory({ ev, variant }: Props) {
  const { activeEventId, activeRole } = useActiveEvent();
  const eventPageData = {
    ...ev,
    myRole:
      ev.myRole ?? (activeEventId === ev.id ? activeRole : undefined) ?? UserRoleType.GUEST,
  };

  switch (variant) {
    case "A":
      return <EventHeaderA ev={eventPageData} />;
    case "B":
      return <EventHeaderB eventPageData={eventPageData} />;
    case "C":
      return <EventHeaderC eventPageData={eventPageData} />;
    case "D":
      return <EventHeaderD eventPageData={eventPageData} />;
    default:
      return <EventHeaderC eventPageData={eventPageData} />;
  }
}

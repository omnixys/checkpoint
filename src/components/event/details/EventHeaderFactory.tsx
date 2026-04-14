"use client";

import EventHeaderA from "@/checkpoint/components/event/details/header/EventHeaderA";
import EventHeaderB from "@/checkpoint/components/event/details/header/EventHeaderB";
import EventHeaderC from "@/checkpoint/components/event/details/header/EventHeaderC";
import EventHeaderD from "@/checkpoint/components/event/details/header/EventHeaderD";
import { EventPayload } from "@/checkpoint/generated/graphql";
import { EventVariant } from "@/checkpoint/hooks/events/useEventVariant";

/**
 * Factory for rendering event headers.
 *
 * WHY:
 * - Removes conditional logic from pages
 * - Central place for variant control
 * - Scalable for future variants
 */
type Props = {
  ev: EventPayload;
  variant: EventVariant;
};

export default function EventHeaderFactory({ ev, variant }: Props) {
  switch (variant) {
    case "A":
      return <EventHeaderA ev={ev} />;
    case "B":
      return <EventHeaderB ev={ev} />;
    case "C":
      return <EventHeaderC ev={ev} />;
    case "D":
      return <EventHeaderD ev={ev} />;
    default:
      return <EventHeaderC ev={ev} />;
  }
}

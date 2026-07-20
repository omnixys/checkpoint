"use client";

import type { EventPageQuery } from "@/checkpoint/generated/graphql";
import type { Safe } from "@/checkpoint/types/core/core.type";
import QuickActionPanel from "./QuickActionPanel";

export interface EventHeaderProps {
  eventPageData: Safe<EventPageQuery["event"]>;
}

export default function EventActions(_props: EventHeaderProps) {
  return <QuickActionPanel />;
}

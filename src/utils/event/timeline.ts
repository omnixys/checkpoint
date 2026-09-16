/**
 * timeline.ts
 *
 * The event timeline is the user-managed EVENT PROGRAM (Dinner, First Dance, ...).
 * Operational records (invitation/ticket/scan milestones written by the event
 * service from Kafka `event.milestoneRecorded`) and lifecycle system entries
 * (event-created/activated/deactivated) MUST NOT surface as program entries.
 *
 * Milestone entries always carry a `sourceId`; user-created and seed program
 * entries have `sourceId: null`.
 */

export const SYSTEM_TIMELINE_TYPES: ReadonlySet<string> = new Set([
  "event-created",
  "event-activated",
  "event-deactivated",
]);

export interface TimelineEntryLike {
  type: string;
  sourceId?: string | null;
}

/**
 * Returns true when the entry is an operational/system entry instead of a
 * user-managed event program entry.
 */
export function isSystemTimelineEntry<T extends TimelineEntryLike>(entry: T): boolean {
  return Boolean(entry.sourceId) || SYSTEM_TIMELINE_TYPES.has(entry.type);
}

/**
 * Keeps only user-managed event program entries.
 */
export function filterProgramTimeline<T extends TimelineEntryLike>(
  entries: readonly T[] | null | undefined,
): T[] {
  return (entries ?? []).filter((entry) => !isSystemTimelineEntry(entry));
}

/**
 * Kind of timeline entry for display purposes.
 */
export function timelineEntryKind(entry: TimelineEntryLike): "program" | "milestone" | "system" {
  if (entry.sourceId) {
    return "milestone";
  }
  if (SYSTEM_TIMELINE_TYPES.has(entry.type)) {
    return "system";
  }
  return "program";
}

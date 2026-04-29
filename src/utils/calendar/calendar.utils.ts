import { GetMyEventCalendarDataQuery } from "@/checkpoint/generated/graphql";

/**
 * Normalize any date into a stable day key.
 * Ensures consistent grouping and comparison across the app.
 */
export function getDateKey(date: Date | string): string {
  return new Date(date).toDateString();
}

/**
 * Groups events by day for efficient rendering.
 */
export function groupEventsByDay(
  events: GetMyEventCalendarDataQuery["myEvents"] | undefined,
): Map<string, any[]> | undefined {
  const map = new Map<string, any[]>();

  if (!events || events?.length === 0) {
    return;
  }
  for (const event of events) {
    const key = getDateKey(event.settings?.startsAt);

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key)!.push(event);
  }

  return map;
}

/**
 * Returns all events for a given day.
 */
export function getEventsForDay(events: readonly any[], date: Date): any[] {
  const key = getDateKey(date);

  return events.filter((e) => getDateKey(e.settings.startsAt) === key);
}

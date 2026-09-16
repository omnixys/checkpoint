import { describe, expect, it } from "vitest";
import {
  filterProgramTimeline,
  isSystemTimelineEntry,
  timelineEntryKind,
} from "@/checkpoint/utils/event/timeline";

interface Entry {
  id: string;
  type: string;
  label: string;
  sourceId?: string | null;
}

function program(id: string, type = "PROGRAM"): Entry {
  return { id, type, label: id, sourceId: null };
}

function milestone(id: string, type = "ticket-generated"): Entry {
  return { id, type, label: id, sourceId: `${id}:generated` };
}

function system(id: string, type = "event-activated"): Entry {
  return { id, type, label: id, sourceId: null };
}

describe("isSystemTimelineEntry", () => {
  it("keeps program entries with a null sourceId", () => {
    expect(isSystemTimelineEntry(program("dinner"))).toBe(false);
  });

  it("flags milestone entries that carry a sourceId", () => {
    expect(isSystemTimelineEntry(milestone("ticket-1"))).toBe(true);
  });

  it("flags lifecycle system entries regardless of sourceId", () => {
    expect(isSystemTimelineEntry(system("ev-1", "event-created"))).toBe(true);
    expect(isSystemTimelineEntry(system("ev-1", "event-activated"))).toBe(true);
    expect(isSystemTimelineEntry(system("ev-1", "event-deactivated"))).toBe(true);
  });
});

describe("filterProgramTimeline", () => {
  it("returns an empty array for null or undefined input", () => {
    expect(filterProgramTimeline(null)).toEqual([]);
    expect(filterProgramTimeline(undefined)).toEqual([]);
  });

  it("keeps program entries and drops milestones plus lifecycle entries", () => {
    const entries = [
      program("dinner"),
      milestone("ticket-1"),
      system("ev-1", "event-created"),
      program("first-dance", "PROGRAM"),
      milestone("invitation-1", "invitation-created"),
    ];

    expect(filterProgramTimeline(entries).map((entry) => entry.id)).toEqual([
      "dinner",
      "first-dance",
    ]);
  });

  it("does not mutate the input array", () => {
    const entries = [program("dinner")];
    const result = filterProgramTimeline(entries);

    expect(entries).toHaveLength(1);
    expect(result).not.toBe(entries);
  });
});

describe("timelineEntryKind", () => {
  it("classifies entries as program, milestone, or system", () => {
    expect(timelineEntryKind(program("dinner"))).toBe("program");
    expect(timelineEntryKind(milestone("ticket-1"))).toBe("milestone");
    expect(timelineEntryKind(system("ev-1", "event-deactivated"))).toBe("system");
  });
});

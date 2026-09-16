import { ThemeProvider } from "@mui/material/styles";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createAppTheme } from "@/checkpoint/themes/createAppTheme";
import TimelineSection, { type TimelineItem } from "./TimelineSection";

vi.mock("@/checkpoint/components/event/settings/sections/timeline/TimelineActionsToolbar", () => ({
  default: () => null,
}));
vi.mock("@/checkpoint/components/event/settings/sections/timeline/TimelineImportExport", () => ({
  TimelineImportExport: () => null,
}));
vi.mock("@/checkpoint/components/event/settings/sections/timeline/TimelineTicketPreview", () => ({
  default: () => null,
}));

interface PayloadItem extends TimelineItem {
  sourceId?: string | null;
  __typename?: string;
}

function makeItem(overrides: Partial<PayloadItem> = {}): PayloadItem {
  return {
    id: "tl-1",
    type: "PROGRAM",
    label: "Dinner",
    timestamp: "2026-09-16T18:00:00.000Z",
    ...overrides,
  };
}

function renderSection(timeline: TimelineItem[], actions: Partial<ReturnType<() => object>> = {}) {
  return render(
    <ThemeProvider theme={createAppTheme("light")}>
      <TimelineSection
        eventName="Wedding"
        timeline={timeline}
        actions={{
          addTimeline: vi.fn().mockResolvedValue(undefined),
          updateTimeline: vi.fn().mockResolvedValue(undefined),
          removeTimeline: vi.fn().mockResolvedValue(undefined),
          ...actions,
        }}
      />
    </ThemeProvider>,
  );
}

describe("TimelineSection", () => {
  afterEach(cleanup);

  it("renders program entries and filters operational and system entries", () => {
    const timeline: TimelineItem[] = [
      makeItem(),
      makeItem({
        id: "tl-2",
        type: "ticket-generated",
        label: "Ticket created",
        sourceId: "tl-2:generated",
      }),
      makeItem({ id: "tl-3", type: "event-activated", label: "Event activated" }),
    ] as TimelineItem[];

    renderSection(timeline);

    expect(screen.getByDisplayValue("Dinner")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("Ticket created")).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue("Event activated")).not.toBeInTheDocument();
  });

  it("persists removed program entries via Save Removals", async () => {
    const removeTimeline = vi.fn().mockResolvedValue(undefined);
    renderSection([makeItem()], { removeTimeline });

    fireEvent.click(screen.getByRole("button", { name: "Remove timeline item" }));
    fireEvent.click(screen.getByRole("button", { name: "Save Removals" }));

    expect(removeTimeline).toHaveBeenCalledWith(["tl-1"]);
    expect(screen.queryByDisplayValue("Dinner")).not.toBeInTheDocument();
  });

  it("surfaces remove failures instead of swallowing them", async () => {
    const removeTimeline = vi.fn().mockRejectedValue(new Error("Timeline explosion"));
    renderSection([makeItem()], { removeTimeline });

    fireEvent.click(screen.getByRole("button", { name: "Remove timeline item" }));
    fireEvent.click(screen.getByRole("button", { name: "Save Removals" }));

    await screen.findByRole("alert");

    expect(screen.getByRole("alert")).toHaveTextContent("Timeline explosion");
    expect(screen.getByRole("button", { name: "Save Removals" })).toBeEnabled();
  });

  it("adds a new entry and persists it via Save New Entries", () => {
    const addTimeline = vi.fn().mockResolvedValue(undefined);
    renderSection([], { addTimeline });

    fireEvent.change(screen.getByLabelText("Label"), { target: { value: "First Dance" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    fireEvent.click(screen.getByRole("button", { name: "Save New Entries" }));

    expect(addTimeline).toHaveBeenCalledTimes(1);
    const items = addTimeline.mock.calls[0]![0] as TimelineItem[];
    const [first] = items;

    expect(items).toHaveLength(1);
    expect(first?.label).toBe("First Dance");
    expect(first?.type).toBe("INFO");
  });
});

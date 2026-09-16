import { describe, expect, it } from "vitest";
import { SeatColorGroupMatchType } from "@/checkpoint/generated/graphql";
import {
  type SeatColorGroupLike,
  toSeatColorGroupInput,
} from "@/checkpoint/utils/event/seatColorGroup.mapper";

function makeGroup(overrides: Partial<SeatColorGroupLike> = {}): SeatColorGroupLike {
  return {
    id: "group-1",
    name: "VIP",
    matchType: SeatColorGroupMatchType.SINGLE,
    invitedByValues: ["me"],
    priority: 10,
    order: 0,
    style: {
      background: "#E53935",
      foreground: "#FFFFFF",
      border: "#C62828",
      legendIcon: "#E53935",
    },
    ...overrides,
  };
}

describe("toSeatColorGroupInput", () => {
  it("maps all editable fields", () => {
    const input = toSeatColorGroupInput(makeGroup());

    expect(input).toEqual({
      id: "group-1",
      name: "VIP",
      matchType: SeatColorGroupMatchType.SINGLE,
      invitedByValues: ["me"],
      priority: 10,
      order: 0,
      style: {
        background: "#E53935",
        foreground: "#FFFFFF",
        border: "#C62828",
        legendIcon: "#E53935",
      },
    });
  });

  it("strips read-only payload fields like isOrphaned and __typename", () => {
    const group: SeatColorGroupLike = {
      ...makeGroup(),
      isOrphaned: true,
      __typename: "SeatColorGroup",
    } as unknown as SeatColorGroupLike;

    const input = toSeatColorGroupInput(group);

    expect(input).not.toHaveProperty("isOrphaned");
    expect(input).not.toHaveProperty("__typename");
  });

  it("falls back to the default style when style is missing", () => {
    const input = toSeatColorGroupInput(makeGroup({ style: null }));

    expect(input.style).toEqual({
      background: "#E53935",
      foreground: "#FFFFFF",
      border: "#C62828",
      legendIcon: "#E53935",
    });
  });

  it("falls back for empty style fields", () => {
    const input = toSeatColorGroupInput(
      makeGroup({ style: { background: "", foreground: null, border: null, legendIcon: null } }),
    );

    expect(input.style).toEqual({
      background: "#E53935",
      foreground: "#FFFFFF",
      border: "#C62828",
      legendIcon: "#E53935",
    });
  });

  it("defaults invitedByValues and order", () => {
    const { order: _omit, ...rest } = makeGroup({ invitedByValues: null });

    const input = toSeatColorGroupInput(rest);

    expect(input.invitedByValues).toEqual([]);
    expect(input.order).toBe(0);
  });

  it("sends null for the id when it is empty", () => {
    const input = toSeatColorGroupInput(makeGroup({ id: "" }));

    expect(input.id).toBeNull();
  });
});

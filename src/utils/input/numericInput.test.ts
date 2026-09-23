import { describe, expect, it, vi } from "vitest";
import {
  blockNonNumericKey,
  isAllowedNumericKey,
  numericHtmlInput,
  stripNonDigits,
  stripNonDigitsAllowPlus,
} from "@/checkpoint/utils/input/numericInput";

function keyboardEvent(overrides: {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
}): KeyboardEvent {
  return {
    key: overrides.key,
    ctrlKey: overrides.ctrlKey ?? false,
    metaKey: overrides.metaKey ?? false,
    altKey: overrides.altKey ?? false,
  } as KeyboardEvent;
}

describe("stripNonDigits", () => {
  it.each([
    ["17612345678", "17612345678"],
    ["+49 176 12345678", "4917612345678"],
    ["(012) 345-6789", "0123456789"],
    ["abc123!@#", "123"],
    ["", ""],
  ])("keeps only digits from %j", (input, expected) => {
    expect(stripNonDigits(input)).toBe(expected);
  });
});

describe("stripNonDigitsAllowPlus", () => {
  it.each([
    ["+41", "+41"],
    ["++41", "+41"],
    ["+49 176 12345678", "+4917612345678"],
    ["phone:+41123", "+41123"],
    ["abc", ""],
  ])("keeps digits and a leading plus from %j", (input, expected) => {
    expect(stripNonDigitsAllowPlus(input)).toBe(expected);
  });
});

describe("isAllowedNumericKey", () => {
  it("allows digit keys", () => {
    for (const key of ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
      expect(isAllowedNumericKey(keyboardEvent({ key }))).toBe(true);
    }
  });

  it.each(["e", "E", "+", "-", ".", ",", "a", "Z", " "])("blocks %j", (key) => {
    expect(isAllowedNumericKey(keyboardEvent({ key }))).toBe(false);
  });

  it.each([
    "Backspace",
    "Delete",
    "Tab",
    "Escape",
    "Enter",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
  ])("allows the control/navigation key %s", (key) => {
    expect(isAllowedNumericKey(keyboardEvent({ key }))).toBe(true);
  });

  it("allows function and named keys", () => {
    expect(isAllowedNumericKey(keyboardEvent({ key: "F5" }))).toBe(true);
    expect(isAllowedNumericKey(keyboardEvent({ key: "ContextMenu" }))).toBe(true);
  });

  it("allows modifier shortcuts", () => {
    expect(isAllowedNumericKey(keyboardEvent({ key: "a", ctrlKey: true }))).toBe(true);
    expect(isAllowedNumericKey(keyboardEvent({ key: "c", metaKey: true }))).toBe(true);
    expect(isAllowedNumericKey(keyboardEvent({ key: "z", metaKey: true, altKey: true }))).toBe(
      true,
    );
  });

  it("blocks the plus key even with shift pressed", () => {
    expect(isAllowedNumericKey(keyboardEvent({ key: "+" }))).toBe(false);
  });
});

describe("blockNonNumericKey", () => {
  it("prevents default for disallowed characters", () => {
    const preventDefault = vi.fn();
    blockNonNumericKey({ ...keyboardEvent({ key: "e" }), preventDefault });
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it("does not prevent default for digits or control keys", () => {
    for (const key of ["1", "Backspace", "ArrowRight"]) {
      const preventDefault = vi.fn();
      blockNonNumericKey({ ...keyboardEvent({ key }), preventDefault });
      expect(preventDefault).not.toHaveBeenCalled();
    }
  });
});

describe("numericHtmlInput", () => {
  it("defaults to a numeric input mode without constraints", () => {
    expect(numericHtmlInput()).toEqual({ inputMode: "numeric" });
  });

  it("carries min/max/step through", () => {
    expect(numericHtmlInput({ min: 1, max: 10, step: 2 })).toEqual({
      inputMode: "numeric",
      min: 1,
      max: 10,
      step: 2,
    });
  });

  it("omits constraints that are not provided", () => {
    expect(numericHtmlInput({ min: 0 })).toEqual({
      inputMode: "numeric",
      min: 0,
    });
  });
});

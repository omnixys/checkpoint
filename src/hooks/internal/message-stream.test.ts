import { describe, expect, it } from "vitest";
import { appendMessageById, mergeMessagesById } from "./message-stream";

describe("notification message stream", () => {
  it("keeps multiple realtime messages in arrival order", () => {
    expect(
      mergeMessagesById(
        [{ id: "initial", body: "Initial" }],
        [
          { id: "first", body: "First" },
          { id: "second", body: "Second" },
        ],
      ),
    ).toEqual([
      { id: "initial", body: "Initial" },
      { id: "first", body: "First" },
      { id: "second", body: "Second" },
    ]);
  });

  it("deduplicates a mutation and subscription event with the same id", () => {
    const mutation = { id: "message-1", body: "Pending" };
    const subscription = { id: "message-1", body: "Delivered" };

    const result = appendMessageById(appendMessageById([], mutation), subscription);

    expect(result).toEqual([subscription]);
  });
});

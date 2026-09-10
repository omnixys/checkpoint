import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { importLayout } from "../core/adapter";
import { moveNode } from "../core/document";
import { source } from "../core/test-fixture";
import { recognitionSchema } from "./contract";
import { analyzeLayoutSource } from "./transport";
import { useDraftLossWarning } from "./useDraftLossWarning";
import { useLocalLayoutDraft } from "./useLocalLayoutDraft";

vi.mock("@/checkpoint/config/env", () => ({ env: { SEAT_API: "http://localhost:7409" } }));
const before = importLayout("event", source);
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
describe("local imports", () => {
  it("keeps all edits local through refetch and discards to latest server document", async () => {
    const persist = vi.fn(async () => {});
    const { result, rerender } = renderHook(
      ({ server }) => useLocalLayoutDraft("event", server, persist),
      { initialProps: { server: before } },
    );
    const after = { ...before, order: [...before.order] };
    act(() => result.current.accept({ before, after, newIds: [] }));
    expect(result.current.isLocal).toBe(true);
    const moved = moveNode(after, "section", { x: 100, y: 0 });
    await act(() => result.current.move({ nodeId: "section", before: after, after: moved }));
    expect(persist).not.toHaveBeenCalled();
    expect(result.current.document).toBe(moved);
    const latest = moveNode(before, "section", { x: -100, y: 0 });
    rerender({ server: latest });
    expect(result.current.document).toBe(moved);
    act(() => result.current.discard());
    expect(result.current.document).toBe(latest);
    expect(result.current.isLocal).toBe(false);
  });
  it("rejects stale import acceptance and isolates events", () => {
    const { result, rerender } = renderHook(
      ({ event }) => useLocalLayoutDraft(event, before, vi.fn()),
      { initialProps: { event: "event" } },
    );
    expect(() =>
      result.current.accept({ before: { ...before }, after: before, newIds: [] }),
    ).toThrow(/geändert/);
    act(() => result.current.accept({ before, after: { ...before }, newIds: [] }));
    rerender({ event: "another" });
    expect(result.current.isLocal).toBe(false);
  });
  it("warns on reload only while a draft exists", () => {
    const { rerender } = renderHook(({ dirty }) => useDraftLossWarning(dirty), {
      initialProps: { dirty: true },
    });
    const event = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    rerender({ dirty: false });
    const clean = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(clean);
    expect(clean.defaultPrevented).toBe(false);
  });
  it("rejects route navigation when the user cancels loss of changes", () => {
    const navigation = new EventTarget();
    Object.defineProperty(window, "navigation", { configurable: true, value: navigation });
    vi.spyOn(window, "confirm").mockReturnValue(false);
    renderHook(() => useDraftLossWarning(true));
    const event = Object.assign(new Event("navigate", { cancelable: true }), {
      canIntercept: true,
      hashChange: false,
      destination: { url: "http://localhost/other" },
    });
    navigation.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    Reflect.deleteProperty(window, "navigation");
  });
});
describe("recognition boundary", () => {
  const result = {
    recognizer: "geometry-v1",
    elements: [],
    warnings: [],
    analysis: { width: 100, height: 100, threshold: null },
  };
  it("sends one multipart request with cookie auth, no source names or GraphQL writes", async () => {
    const request = vi.fn(async () => new Response(JSON.stringify(result), { status: 200 }));
    vi.stubGlobal("fetch", request);
    const originalFile = new File(["image"], "private-name.png", { type: "image/png" });
    await analyzeLayoutSource(
      "event",
      {
        png: originalFile,
        originalFile,
        previewUrl: "blob:test",
        metadata: { kind: "IMAGE", name: "private-name", width: 100, height: 100 },
      },
      new AbortController().signal,
    );
    expect(request).toHaveBeenCalledTimes(1);
    const [url, options] = request.mock.calls[0] as unknown as [string, RequestInit];
    expect(url.endsWith("/layout-import/event/analyze")).toBe(true);
    expect(options.credentials).toBe("include");
    const form = options.body as FormData;
    expect([...form.keys()].sort()).toEqual(["metadata", "originalSource", "preparedImage"]);
    expect(JSON.parse(String(form.get("metadata")))).toEqual({
      kind: "IMAGE",
      width: 100,
      height: 100,
    });
  });
  it("rejects invalid server results", () => {
    expect(
      recognitionSchema.safeParse({ ...result, analysis: { ...result.analysis, width: Infinity } })
        .success,
    ).toBe(false);
  });
  it("propagates abort and visible server errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () => new Response(JSON.stringify({ message: "Ungültiges Bild" }), { status: 422 }),
      ),
    );
    const file = new File(["x"], "x.png");
    const data = {
      png: file,
      originalFile: file,
      previewUrl: "blob:x",
      metadata: { kind: "IMAGE" as const, name: "x", width: 1, height: 1 },
    };
    await expect(analyzeLayoutSource("event", data, new AbortController().signal)).rejects.toThrow(
      "Ungültiges Bild",
    );
  });
});

import { act, cleanup, fireEvent, renderHook } from "@testing-library/react";
import { type PropsWithChildren, StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { confirmAppNavigation } from "@/checkpoint/lib/navigation/confirm-navigation";
import { confirmDraftNavigation, useDraftLossWarning } from "./useDraftLossWarning";

const baseUrl = location.href;
let restoreUrl: () => void;
function controlledHistory() {
  const nativeReplace = history.replaceState.bind(history);
  restoreUrl = () => nativeReplace(null, "", baseUrl);
  const entries = [
    { state: { previous: true }, url: new URL("/previous", baseUrl).href },
    { state: { routerTree: { preserved: true } }, url: new URL("/event/a/seat", baseUrl).href },
  ] as { state: unknown; url: string }[];
  let index = 1;
  nativeReplace(entries[index]!.state, "", entries[index]!.url);
  const push = vi.spyOn(history, "pushState").mockImplementation((state, _unused, url) => {
    const entry = {
      state,
      url: url == null ? location.href : new URL(String(url), location.href).href,
    };
    entries.splice(index + 1, entries.length, entry);
    index++;
    nativeReplace(state, "", entry.url);
  });
  const replace = vi.spyOn(history, "replaceState").mockImplementation((state, _unused, url) => {
    entries[index] = {
      state,
      url: url == null ? location.href : new URL(String(url), location.href).href,
    };
    nativeReplace(state, "", entries[index]!.url);
  });
  const pending: number[] = [];
  const go = vi.spyOn(history, "go").mockImplementation((delta) => {
    pending.push(delta ?? 0);
  });
  const travel = (delta: number) => {
    index += delta;
    const entry = entries[index]!;
    nativeReplace(entry.state, "", entry.url);
    window.dispatchEvent(new PopStateEvent("popstate", { state: entry.state }));
  };
  const flush = () => {
    const delta = pending.shift();
    if (delta !== undefined) travel(delta);
  };
  return { entries, push, replace, go, travel, flush };
}

beforeEach(() => {
  Object.defineProperty(window, "navigation", { configurable: true, value: undefined });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  restoreUrl?.();
  Reflect.deleteProperty(window, "navigation");
});

describe("draft navigation without Navigation API", () => {
  it("blocks native Back before router listeners and returns to the sentinel when canceled", () => {
    const browser = controlledHistory();
    const router = vi.fn();
    window.addEventListener("popstate", router);
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    const view = renderHook(() => useDraftLossWarning(true));
    expect(browser.entries).toHaveLength(3);
    expect(history.state.routerTree).toEqual({ preserved: true });
    act(() => browser.travel(-1));
    expect(confirm).toHaveBeenCalledOnce();
    expect(router).not.toHaveBeenCalled();
    expect(browser.go).toHaveBeenLastCalledWith(1);
    act(() => browser.flush());
    expect(router).not.toHaveBeenCalled();
    expect(location.pathname).toBe("/event/a/seat");
    view.unmount();
    window.removeEventListener("popstate", router);
  });

  it("accepted Back traverses the sentinel and lets the real previous route reach the router once", () => {
    const browser = controlledHistory();
    const router = vi.fn();
    window.addEventListener("popstate", router);
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(true);
    const view = renderHook(() => useDraftLossWarning(true));
    act(() => browser.travel(-1));
    expect(router).not.toHaveBeenCalled();
    expect(browser.go).toHaveBeenLastCalledWith(-1);
    act(() => browser.flush());
    expect(location.pathname).toBe("/previous");
    expect(router).toHaveBeenCalledOnce();
    expect(confirm).toHaveBeenCalledOnce();
    view.unmount();
    window.removeEventListener("popstate", router);
  });

  it("restores a canceled multi-entry traversal without exposing the other route to the router", () => {
    const browser = controlledHistory();
    const router = vi.fn();
    window.addEventListener("popstate", router);
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const view = renderHook(() => useDraftLossWarning(true));
    act(() => browser.travel(-2));
    expect(location.pathname).toBe("/event/a/seat");
    expect(router).not.toHaveBeenCalled();
    expect(history.state.routerTree).toEqual({ preserved: true });
    view.unmount();
    window.removeEventListener("popstate", router);
  });

  it("guards anchors and direct history calls without duplicate confirmation", () => {
    controlledHistory();
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    renderHook(() => useDraftLossWarning(true));
    const anchor = document.createElement("a");
    anchor.href = "/next";
    document.body.append(anchor);
    const event = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
    fireEvent(anchor, event);
    expect(event.defaultPrevented).toBe(true);
    history.pushState({ next: true }, "", "/next");
    history.replaceState({ next: true }, "", "/next");
    expect(location.pathname).toBe("/event/a/seat");
    expect(confirm).toHaveBeenCalledTimes(3);
    confirm.mockReturnValue(true);
    // The click is followed by the router's history write for the same destination.
    const click = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
    const preventNative = (e: MouseEvent) => e.preventDefault();
    anchor.addEventListener("click", preventNative);
    fireEvent(anchor, click);
    history.pushState({ next: true }, "", "/next");
    expect(location.pathname).toBe("/next");
    expect(confirm).toHaveBeenCalledTimes(4);
    anchor.remove();
  });

  it("restores original history methods and latest caller state, reusing one sentinel through StrictMode", () => {
    const browser = controlledHistory();
    const wrapper = ({ children }: PropsWithChildren) => <StrictMode>{children}</StrictMode>;
    const { rerender, unmount } = renderHook(({ dirty }) => useDraftLossWarning(dirty), {
      initialProps: { dirty: true },
      wrapper,
    });
    expect(browser.entries).toHaveLength(3);
    history.replaceState({ routerTree: { updated: true } }, "");
    rerender({ dirty: false });
    expect(history.state).toEqual({ routerTree: { updated: true } });
    expect(history.pushState).toBe(browser.push);
    expect(history.replaceState).toBe(browser.replace);
    rerender({ dirty: true });
    expect(browser.entries).toHaveLength(3);
    unmount();
    expect(history.state).toEqual({ routerTree: { updated: true } });
  });

  it("offers an explicit confirmation helper for imperative router entry points", () => {
    controlledHistory();
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    expect(confirmDraftNavigation(false, "/other")).toBe(true);
    expect(confirmDraftNavigation(true, "/event/a/seat#table")).toBe(true);
    expect(confirmDraftNavigation(true, "/other")).toBe(false);
    expect(confirm).toHaveBeenCalledOnce();
  });
});

it("blocks an imperative app navigation before the router or logout is invoked", () => {
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
  const { unmount } = renderHook(() => useDraftLossWarning(true));
  expect(confirmAppNavigation("/next-route")).toBe(false);
  expect(confirm).toHaveBeenCalledTimes(1);
  unmount();
  expect(confirmAppNavigation("/next-route")).toBe(true);
});

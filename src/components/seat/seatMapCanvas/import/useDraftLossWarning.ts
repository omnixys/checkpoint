"use client";
import { useEffect, useRef } from "react";
import { BEFORE_APP_NAVIGATION } from "@/checkpoint/lib/navigation/confirm-navigation";

const message = "Der lokale Sitzplan ist nicht gespeichert. Änderungen beim Verlassen verwerfen?";
const marker = "__checkpointLayoutDraftGuard";
interface NavigateEvent extends Event {
  canIntercept: boolean;
  hashChange: boolean;
  destination: { url: string };
}

/** Call before an imperative router.push/replace: routers may render before writing history. */
export function confirmDraftNavigation(dirty: boolean, destination: string): boolean {
  return (
    !dirty ||
    new URL(destination, location.href).pathname === location.pathname ||
    window.confirm(message)
  );
}

/** Public browser APIs only; Next links are guarded before their click handler runs. */
export function useDraftLossWarning(dirty: boolean) {
  // Reuse the same extra entry through StrictMode effect replay and clean/dirty transitions.
  const sentinel = useRef<{ token: string; url: string } | null>(null);
  useEffect(() => {
    if (!dirty) return;
    const history = window.history;
    const navigation = (window as unknown as { navigation?: EventTarget }).navigation;
    let approvedDestination: string | null = null;
    let leaving = false;
    const approve = (destination: string) => {
      const url = new URL(destination, location.href);
      if (url.pathname === location.pathname) return true;
      if (approvedDestination === url.href) return true;
      if (!window.confirm(message)) return false;
      approvedDestination = url.href;
      return true;
    };
    const appNavigate = (event: Event) => {
      const destination = (event as CustomEvent<{ destination: string }>).detail.destination;
      if (!approve(destination)) event.preventDefault();
    };
    window.addEventListener(BEFORE_APP_NAVIGATION, appNavigate);
    const unload = (event: BeforeUnloadEvent) => {
      if (leaving) return;
      if (approvedDestination) {
        approvedDestination = null;
        return;
      }
      event.preventDefault();
      event.returnValue = "";
    };
    const navigate = (event: Event) => {
      const e = event as NavigateEvent;
      if (e.canIntercept && !e.hashChange && !approve(e.destination.url)) e.preventDefault();
    };
    const click = (event: MouseEvent) => {
      if (
        navigation ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const target = event.target;
      const link = target instanceof Element ? target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.download || (link.target && link.target !== "_self")) return;
      if (!approve(link.href)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    window.addEventListener("beforeunload", unload);
    document.addEventListener("click", click, true);
    if (navigation) {
      navigation.addEventListener("navigate", navigate);
      return () => {
        window.removeEventListener(BEFORE_APP_NAVIGATION, appNavigate);
        window.removeEventListener("beforeunload", unload);
        document.removeEventListener("click", click, true);
        navigation.removeEventListener("navigate", navigate);
      };
    }

    const push = history.pushState;
    const replace = history.replaceState;
    const go = history.go;
    const origin = location.href;
    const token = sentinel.current?.url === origin ? sentinel.current.token : crypto.randomUUID();
    let originalState = history.state;
    let restoring = false;
    let passNextTraversal = false;
    const isSentinel = (state: unknown) =>
      state !== null &&
      typeof state === "object" &&
      (state as Record<string, unknown>)[marker] === token;
    const marked = (state: unknown) => ({
      ...(state !== null && typeof state === "object" ? state : {}),
      [marker]: token,
    });
    if (sentinel.current?.url === origin) replace.call(history, marked(originalState), "", origin);
    else push.call(history, marked(originalState), "", origin);
    sentinel.current = { token, url: origin };

    const pushGuard: History["pushState"] = (data, unused, url) => {
      if (url != null && !approve(String(url))) return;
      if (url != null && new URL(String(url), location.href).pathname !== location.pathname)
        leaving = true;
      push.call(history, data, unused, url);
    };
    const replaceGuard: History["replaceState"] = (data, unused, url) => {
      if (url != null && !approve(String(url))) return;
      const changesRoute =
        url != null && new URL(String(url), location.href).pathname !== location.pathname;
      if (changesRoute) leaving = true;
      if (!changesRoute && isSentinel(history.state)) {
        originalState = data;
        replace.call(history, marked(data), unused, url);
      } else replace.call(history, data, unused, url);
    };
    const pop = (event: PopStateEvent) => {
      if (passNextTraversal) {
        passNextTraversal = false;
        return;
      }
      if (isSentinel(event.state)) {
        // Internal restoration must not reach the router and recreate the editor.
        event.stopImmediatePropagation();
        restoring = false;
        return;
      }
      if (restoring) {
        event.stopImmediatePropagation();
        return;
      }
      if (location.href === origin) {
        // Native Back landed on the original entry, still showing the draft URL.
        event.stopImmediatePropagation();
        if (window.confirm(message)) {
          leaving = true;
          passNextTraversal = true;
          go.call(history, -1);
        } else {
          restoring = true;
          go.call(history, 1);
        }
      } else if (new URL(location.href).pathname !== new URL(origin).pathname) {
        // A native multi-entry history jump can skip the sentinel. Stop the router
        // synchronously; cancellation restores the draft URL and truncates that forward branch.
        if (window.confirm(message)) leaving = true;
        else {
          event.stopImmediatePropagation();
          push.call(history, marked(originalState), "", origin);
        }
      }
    };
    history.pushState = pushGuard;
    history.replaceState = replaceGuard;
    window.addEventListener("popstate", pop, true);
    return () => {
      window.removeEventListener(BEFORE_APP_NAVIGATION, appNavigate);
      window.removeEventListener("beforeunload", unload);
      document.removeEventListener("click", click, true);
      window.removeEventListener("popstate", pop, true);
      if (history.pushState === pushGuard) history.pushState = push;
      if (history.replaceState === replaceGuard) history.replaceState = replace;
      if (isSentinel(history.state)) replace.call(history, originalState, "", location.href);
      // History has no remove-entry API. The cleaned same-URL entry is harmless;
      // reuse it if this mounted editor becomes dirty again instead of adding another.
    };
  }, [dirty]);
}

/** Synchronous app navigation boundary, before a router renders or logout clears session state. */
export const BEFORE_APP_NAVIGATION = "checkpoint:before-app-navigation";
export function confirmAppNavigation(destination: string): boolean {
  return window.dispatchEvent(
    new CustomEvent(BEFORE_APP_NAVIGATION, {
      cancelable: true,
      detail: { destination },
    }),
  );
}

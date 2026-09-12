import type { JSX } from "react";

/**
 * Matches the `@dialog` slot on `/` so that client-side navigation back to the
 * root page closes the login dialog instead of keeping the slot's stale state.
 */
export default function DialogRootPage(): JSX.Element | null {
  return null;
}

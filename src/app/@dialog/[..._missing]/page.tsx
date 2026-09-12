import type { JSX } from "react";

/**
 * Matches the `@dialog` slot for every URL that is not the intercepted login
 * route. Uses the same `_missing` slug name as the top-level catch-all so the
 * slot stays consistent with the route tree. Closes the login dialog when the
 * user client-side navigates to any other page. The `(.)login` interception
 * takes precedence over this catch-all for `/login`.
 */
export default function DialogCatchAllPage(): JSX.Element | null {
  return null;
}

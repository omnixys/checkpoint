import type { JSX } from "react";

/**
 * Fallback for the `@dialog` slot when the current URL does not match the
 * intercepted login route (hard navigation / refresh). Without this, Next.js
 * renders a 404 for every route where the slot stays unmatched.
 */
export default function DialogDefault(): JSX.Element | null {
  return null;
}

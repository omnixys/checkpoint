import { EventRole } from "@/types/event/event-enum.type";

/* ------------------------------------------------------------------ */
/* Active Navigation Logic */
/* ------------------------------------------------------------------ */

/**
 * Determines the single active navigation path using
 * a "longest match wins" strategy.
 */
export function getActiveNavPath(
  pathname: string,
  itemPaths: string[],
): string | undefined {
  const normalizedPathname = pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

  const matches = itemPaths
    .filter((path) => {
      const fullPath = "/" + path;
      return (
        normalizedPathname === fullPath ||
        normalizedPathname.startsWith(fullPath + "/")
      );
    })
    .sort((a, b) => b.length - a.length);

  return matches[0];
}

/**
 * Convenience helper for per-item active checks.
 */
export function isActiveNavItem(
  pathname: string,
  itemPath: string,
  allItemPaths: string[],
): boolean {
  return getActiveNavPath(pathname, allItemPaths) === itemPath;
}

/* ------------------------------------------------------------------ */
/* Role-based UI Styling */
/* ------------------------------------------------------------------ */

/**
 * Returns the primary accent color for a given event role.
 * Used for active icons, pills, highlights.
 */
export function getRoleColor(role: EventRole): string {
  switch (role) {
    case EventRole.ADMIN:
      return "primary.main";
    case EventRole.SECURITY:
      return "warning.main";
    case EventRole.GUEST:
    default:
      return "text.secondary";
  }
}

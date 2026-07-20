/* ------------------------------------------------------------------ */
/* Active Navigation Logic */
/* ------------------------------------------------------------------ */

import type { UserRoleType } from "@/checkpoint/generated/graphql";

interface NormalizedNavPath {
  original: string;
  normalized: string;
}

export function normalizeNavPath(path: string): string {
  const pathWithoutQuery = path.split(/[?#]/)[0]?.trim() ?? "";
  const absolutePath = pathWithoutQuery.startsWith("/") ? pathWithoutQuery : `/${pathWithoutQuery}`;
  const collapsedPath = absolutePath.replace(/\/{2,}/g, "/");

  if (collapsedPath === "") {
    return "/";
  }

  if (collapsedPath.length > 1 && collapsedPath.endsWith("/")) {
    return collapsedPath.slice(0, -1);
  }

  return collapsedPath;
}

function isPathMatch(pathname: string, itemPath: string): boolean {
  if (itemPath === "/") {
    return pathname === "/";
  }

  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

/**
 * Determines the single active navigation path using
 * a "longest match wins" strategy.
 */
export function getActiveNavPath(pathname: string, itemPaths: string[]): string | undefined {
  const normalizedPathname = normalizeNavPath(pathname);
  const normalizedItemPaths: NormalizedNavPath[] = itemPaths.map((path) => ({
    original: path,
    normalized: normalizeNavPath(path),
  }));

  const matches = normalizedItemPaths
    .filter((path) => isPathMatch(normalizedPathname, path.normalized))
    .sort((a, b) => b.normalized.length - a.normalized.length);

  return matches[0]?.original;
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

export function getRoleColor(role: UserRoleType): string {
  switch (role) {
    case "ADMIN":
      return "primary.main";
    case "SECURITY":
      return "warning.main";
    default:
      return "text.secondary";
  }
}

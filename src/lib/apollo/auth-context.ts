import type { CurrentUserQuery } from "@/checkpoint/generated/graphql";

/**
 * Internal auth context used ONLY for Apollo header injection.
 *
 * This must remain minimal and stable.
 */
interface InternalAuthContext {
  actorId: string | null;
  tenantId: string;
}

/**
 * Global auth context (client-side only).
 *
 * Important:
 * - Do NOT store full user object here
 * - Only store what is required for headers
 */
let context: InternalAuthContext = {
  actorId: null,
  tenantId: "omnixys",
};

/**
 * Set current authenticated user context.
 *
 * This is used by Apollo Link to inject headers.
 */
export function setCurrentUser(user: Omit<CurrentUserQuery["me"], "__typename"> | null): void {
  context = {
    actorId: user?.id ?? null,
    tenantId: "omnixys",
  };
}

/**
 * Get auth context for header injection.
 */
export function getAuthContext(): InternalAuthContext {
  return context;
}

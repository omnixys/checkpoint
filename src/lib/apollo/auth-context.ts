import type { CurrentUserQuery } from "@/checkpoint/generated/graphql";

/**
 * Canonical Omnixys tenant id (mirror of OMNIXYS_TENANT_ID in
 * @omnixys/contracts-ts). Kept local: the published contracts package
 * does not export it for the frontend build.
 */
const OMNIXYS_TENANT_ID = "6e788f7f-c233-4cb8-bbde-c0b855e564be";

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
  tenantId: OMNIXYS_TENANT_ID,
};

/**
 * Set current authenticated user context.
 *
 * This is used by Apollo Link to inject headers.
 */
export function setCurrentUser(user: Omit<CurrentUserQuery["me"], "__typename"> | null): void {
  context = {
    actorId: user?.id ?? null,
    tenantId: OMNIXYS_TENANT_ID,
  };
}

/**
 * Get auth context for header injection.
 */
export function getAuthContext(): InternalAuthContext {
  return context;
}

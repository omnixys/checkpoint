import { MeQuery, MeDocument } from "@/checkpoint/generated/graphql";
import { createServerClient } from "@/checkpoint/lib/apollo/server-client";
import { CurrentUser } from "@/checkpoint/lib/auth/auth.types";

/**
 * Fetches current authenticated user via SSR.
 *
 * Uses:
 * - cookie forwarding
 * - GraphQL "me" query
 *
 * Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const client = await createServerClient();

    const { data } = await client.query<MeQuery>({
      query: MeDocument,
      fetchPolicy: "cache-first",
    });

    if (!data?.me) return null;

    return {
      id: data.me.id,
      username: data.me.username,
      email: data.me.personalInfo?.email,
      role: data.me.role ?? undefined,
    };
  } catch {
    return null;
  }
}

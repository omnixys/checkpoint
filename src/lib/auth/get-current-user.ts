import { MeQuery, MeDocument, CurrentUserQuery, CurrentUserDocument } from "@/checkpoint/generated/graphql";
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
export async function getCurrentUser()  {
  try {
    const client = await createServerClient();

    const { data } = await client.query<CurrentUserQuery>({
      query: CurrentUserDocument,
      fetchPolicy: "cache-first",
    });

    if (!data?.me) return null;

    return data.me;
  } catch {
    return null;
  }
}

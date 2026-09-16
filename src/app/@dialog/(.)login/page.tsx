import { type JSX, Suspense } from "react";
import LoginDialog from "@/checkpoint/components/auth/LoginDialog";
import {
  GetAllCallingCodesDocument,
  type GetAllCallingCodesQuery,
  type GetAllCallingCodesQueryVariables,
} from "@/checkpoint/generated/graphql";
import { createServerClient } from "@/checkpoint/lib/apollo/server-client";
import type { CallingCodeCountry } from "@/checkpoint/types/country.type";

/**
 * Intercepts client-side navigation to `/login`: instead of leaving the
 * current page, the login dialog is shown via the `@dialog` parallel route.
 * Hard navigation / refresh continues to serve the full login page.
 */
export default async function LoginDialogPage(): Promise<JSX.Element> {
  const client = await createServerClient();

  const res = await client.query<GetAllCallingCodesQuery, GetAllCallingCodesQueryVariables>({
    query: GetAllCallingCodesDocument,
    fetchPolicy: "cache-first",
  });

  const callingCodeCountries: CallingCodeCountry[] =
    res?.data?.getAllCountries.map((c) => ({
      iso2: c.iso2,
      name: c.name,
      flagSvg: c.flagSvg,
      callingCode: c.callingCode?.code ?? null,
    })) ?? [];

  return (
    <Suspense fallback={null}>
      <LoginDialog callingCodeCountries={callingCodeCountries} />
    </Suspense>
  );
}

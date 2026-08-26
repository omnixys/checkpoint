import type { Metadata } from "next";
import { type JSX, Suspense } from "react";
import InvitationClientPage from "@/checkpoint/app/(protected)/event/[id]/invitation/InvitationClientPage";
import RsvpLoading from "@/checkpoint/app/rsvp/loading";
import {
  GetAllCallingCodesDocument,
  type GetAllCallingCodesQuery,
  type GetAllCallingCodesQueryVariables,
} from "@/checkpoint/generated/graphql";
import { createServerClient } from "@/checkpoint/lib/apollo/server-client";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import type { CallingCodeCountry } from "@/checkpoint/types/country.type";

export const metadata: Metadata = buildMetadata({
  title: "Invitations",
  description: "Manage invitations and RSVPs.",

  page: "event-invitations",

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },

  disableOpenGraph: true,
});

export default async function RsvpPage(): Promise<JSX.Element> {
  const client = await createServerClient();
  let countries: CallingCodeCountry[] = [];

  try {
    const res = await client.query<GetAllCallingCodesQuery, GetAllCallingCodesQueryVariables>({
      query: GetAllCallingCodesDocument,
      fetchPolicy: "cache-first",
      context: {
        fetchOptions: {
          signal: AbortSignal.timeout(5_000),
        },
      },
    });

    countries =
      res.data?.getAllCountries.map((c) => ({
        iso2: c.iso2,
        name: c.name,
        flagSvg: c.flagSvg,
        callingCode: c.callingCode?.code ?? null,
      })) ?? [];
  } catch {
    // The invitation list must remain available while optional calling-code data is unavailable.
  }

  return (
    <Suspense fallback={<RsvpLoading />}>
      <InvitationClientPage countries={countries} />
    </Suspense>
  );
}

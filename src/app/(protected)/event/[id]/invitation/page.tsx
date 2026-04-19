import InvitationClientPage from "@/checkpoint/app/(protected)/event/[id]/invitation/InvitationClientPage";
import RsvpLoading from "@/checkpoint/app/rsvp/loading";
import {
  GetAllCallingCodesDocument,
  GetAllCallingCodesQuery,
  GetAllCallingCodesQueryVariables,
} from "@/checkpoint/generated/graphql";
import { createServerClient } from "@/checkpoint/lib/apollo/server-client";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import { CallingCodeCountry } from "@/checkpoint/types/country.type";
import { Metadata } from "next";
import { JSX, Suspense } from "react";

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

  const res = await client.query<GetAllCallingCodesQuery, GetAllCallingCodesQueryVariables>({
    query: GetAllCallingCodesDocument,
    fetchPolicy: "cache-first",
  });

  const countries: CallingCodeCountry[] =
    res?.data?.getAllCountries.map((c) => ({
      iso2: c.iso2,
      name: c.name,
      flagSvg: c.flagSvg,
      callingCode: c.callingCode?.code ?? null,
    })) ?? [];

  return (
    <Suspense fallback={<RsvpLoading />}>
      <InvitationClientPage countries={countries} />
    </Suspense>
  );
}

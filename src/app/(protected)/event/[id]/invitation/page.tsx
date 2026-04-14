"use server";

import InvitationClientPage from "@/checkpoint/app/(protected)/event/[id]/invitation/InvitationClientPage";
import RsvpLoading from "@/checkpoint/app/rsvp/loading";
import {
  GetAllCallingCodesDocument,
  GetAllCallingCodesQuery,
  GetAllCallingCodesQueryVariables,
} from "@/checkpoint/generated/graphql";
import { createServerClient } from "@/checkpoint/lib/apollo/server-client";
import { CallingCodeCountry } from "@/checkpoint/types/country.type";
import { JSX, Suspense } from "react";

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

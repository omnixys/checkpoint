"use server";

import { Suspense, JSX } from "react";
import RsvpClient from "./RsvpClient";
import RsvpLoading from "./loading";
import { createServerClient } from "@/checkpoint/lib/apollo/server-client";
import {
  GetAllCountriesQuery,
  GetAllCountriesQueryVariables,
  GetAllCountriesDocument,
  GetAllCallingCodesDocument,
  GetAllCallingCodesQuery,
  GetAllCallingCodesQueryVariables,
} from "@/checkpoint/generated/graphql";
import { CallingCodeCountry } from "@/checkpoint/types/country.type";

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
      <RsvpClient callingCodeCountry={countries} />
    </Suspense>
  );
}

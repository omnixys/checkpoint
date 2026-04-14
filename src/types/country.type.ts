export type CallingCodeCountry = {
  iso2: string;
  name: string;
  flagSvg?: string | null;
  callingCode?: string | null;
};

// const res = await client.query<
//   GetAllCallingCodesQuery,
//   GetAllCallingCodesQueryVariables
// >({
//   query: GetAllCallingCodesDocument,
//   fetchPolicy: "cache-first",
// });

// const countries: CallingCodeCountry[] =
//   res?.data?.getAllCountries.map((c) => ({
//     iso2: c.iso2,
//     name: c.name,
//     flagSvg: c.flagSvg,
//     callingCode: c.callingCode?.code ?? null,
//   })) ?? [];

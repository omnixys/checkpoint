"use client";

import {
  GetGeoLocationInfoDocument,
  GetGeoLocationInfoQuery,
  GetGeoLocationInfoQueryVariables,
} from "@/checkpoint/generated/graphql";

import { useLazyQuery } from "@apollo/client/react";

/**
 * -------------------------------------------------------------
 * Event Address Hook
 * -------------------------------------------------------------
 */
export function useEventAddress() {
  const [loadGeo] = useLazyQuery<GetGeoLocationInfoQuery, GetGeoLocationInfoQueryVariables>(
    GetGeoLocationInfoDocument,
  );

  const resolveGeo = async (text: string) => {
    const res = await loadGeo({
      variables: { text, limit: 1, countryCode: "DE" },
    });

    return res.data?.getGeoLocationInfo ?? null;
  };

  return {
    resolveGeo,
  };
}

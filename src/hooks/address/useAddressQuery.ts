"use client";

import { useLazyQuery, useQuery } from "@apollo/client/react";
import {
  GetEventAddressesByEventIdDocument,
  type GetEventAddressesByEventIdQuery,
  type GetEventAddressesByEventIdQueryVariables,
  GetGeoLocationInfoDocument,
  type GetGeoLocationInfoQuery,
  type GetGeoLocationInfoQueryVariables,
} from "@/checkpoint/generated/graphql";

/**
 * -------------------------------------------------------------
 * Event Address Hook
 * -------------------------------------------------------------
 */
export function useEventAddressQuery(eventId?: string | undefined) {
  const [loadGeo] = useLazyQuery<GetGeoLocationInfoQuery, GetGeoLocationInfoQueryVariables>(
    GetGeoLocationInfoDocument,
  );

  const { data, loading, refetch, error } = useQuery<
    GetEventAddressesByEventIdQuery,
    GetEventAddressesByEventIdQueryVariables
  >(GetEventAddressesByEventIdDocument, {
    variables: { eventId: eventId ?? "" },
    skip: !eventId,
  });

  /**
   * Resolve Geo
   */
  const resolveGeo = async (text: string) => {
    const res = await loadGeo({
      variables: { text, limit: 1, countryCode: "DE" },
    });

    return res.data?.getGeoLocationInfo ?? null;
  };

  return {
    resolveGeo,
    address: data?.getEventAddressByEventId ?? null,
    loading,
    refetch,
    error,
  };
}

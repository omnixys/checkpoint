"use client";

import {
  CreateEventAddressDocument,
  CreateEventAddressMutation,
  CreateEventAddressMutationVariables,
  DeleteEventAddressByEventIdDocument,
  DeleteEventAddressByEventIdMutation,
  DeleteEventAddressByEventIdMutationVariables,
  GetEventAddressesByEventIdDocument,
  GetEventAddressesByEventIdQuery,
  GetEventAddressesByEventIdQueryVariables,
  GetGeoLocationInfoDocument,
  GetGeoLocationInfoQuery,
  GetGeoLocationInfoQueryVariables,
} from "@/checkpoint/generated/graphql";

import { useMutation, useLazyQuery, useQuery } from "@apollo/client/react";

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
    variables: { eventId: eventId ?? '' },
    skip: !eventId
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

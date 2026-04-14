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
export function useEventAddress(eventId: string) {
  /**
   * CREATE
   */
  const [createAddressMutation] = useMutation<
    CreateEventAddressMutation,
    CreateEventAddressMutationVariables
  >(CreateEventAddressDocument);

  /**
   * GEO → ✅ FIX: useLazyQuery (NOT mutation)
   */
  const [loadGeo] = useLazyQuery<GetGeoLocationInfoQuery, GetGeoLocationInfoQueryVariables>(
    GetGeoLocationInfoDocument,
  );

  const { data, loading, refetch } = useQuery<
    GetEventAddressesByEventIdQuery,
    GetEventAddressesByEventIdQueryVariables
  >(GetEventAddressesByEventIdDocument, {
    variables: { eventId },
  });

  const [deleteAddressMutation] = useMutation<
    DeleteEventAddressByEventIdMutation,
    DeleteEventAddressByEventIdMutationVariables
  >(DeleteEventAddressByEventIdDocument);

  /**
   * Resolve Geo
   */
  const resolveGeo = async (text: string) => {
    const res = await loadGeo({
      variables: { text, limit: 1, countryCode: "DE" },
    });

    return res.data?.getGeoLocationInfo ?? null;
  };

  /**
   * Create Address
   */
  const createAddress = async (input: CreateEventAddressMutationVariables["input"]) => {
    return createAddressMutation({
      variables: { input },
    });
  };

  const deleteAddress = async () => {
    await deleteAddressMutation({
      variables: { eventId },
    });
  };

  return {
    createAddress,
    deleteAddress,
    resolveGeo,
    address: data?.getEventAddressByEventId ?? null,
    loading,
    refetch,
  };
}

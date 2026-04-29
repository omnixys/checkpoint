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
export function useEventAddressMutation() {
  const [createAddressMutation] = useMutation<
    CreateEventAddressMutation,
    CreateEventAddressMutationVariables
  >(CreateEventAddressDocument);

  const [deleteAddressMutation] = useMutation<
    DeleteEventAddressByEventIdMutation,
    DeleteEventAddressByEventIdMutationVariables
  >(DeleteEventAddressByEventIdDocument);


  return {
    createAddressMutation,
    deleteAddressMutation
  };
}

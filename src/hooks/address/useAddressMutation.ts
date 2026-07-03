"use client";

import { useMutation } from "@apollo/client/react";
import {
  CreateEventAddressDocument,
  type CreateEventAddressMutation,
  type CreateEventAddressMutationVariables,
  DeleteEventAddressByEventIdDocument,
  type DeleteEventAddressByEventIdMutation,
  type DeleteEventAddressByEventIdMutationVariables,
} from "@/checkpoint/generated/graphql";

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
    deleteAddressMutation,
  };
}

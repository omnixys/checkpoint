import { useMutation } from "@apollo/client/react";
import { useCallback } from "react";
import {
  type PresenceState,
  type TicketPayload,
  UpdateTicketPresenceDocument,
  type UpdateTicketPresenceMutation,
  type UpdateTicketPresenceMutationVariables,
} from "@/checkpoint/generated/graphql";

export function useUpdateTicketPresence() {
  const [updatePresence] = useMutation<
    UpdateTicketPresenceMutation,
    UpdateTicketPresenceMutationVariables
  >(UpdateTicketPresenceDocument);

  return useCallback(
    async (ticketId: string, state: PresenceState): Promise<TicketPayload | null | undefined> => {
      const { data } = await updatePresence({
        variables: {
          input: {
            ticketId,
            state,
          },
        },
      });

      return data?.updateTicketPresence;
    },
    [updatePresence],
  );
}

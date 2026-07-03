import { useMutation } from "@apollo/client/react";
import {
  CreateInvitationFromRsvpDocument,
  type CreateInvitationFromRsvpMutation,
  type CreateInvitationFromRsvpMutationVariables,
} from "@/checkpoint/generated/graphql";

export default function usePublicRsvpMutation() {
  const [createPublicInvitation, publicRsvpMutationResult] = useMutation<
    CreateInvitationFromRsvpMutation,
    CreateInvitationFromRsvpMutationVariables
  >(CreateInvitationFromRsvpDocument);

  return {
    createPublicInvitation,
    publicRsvpLoading: publicRsvpMutationResult.loading,
    publicRsvpError: publicRsvpMutationResult.error,
  };
}

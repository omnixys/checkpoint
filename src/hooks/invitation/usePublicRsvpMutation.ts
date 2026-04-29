import {
  AddPlusOneDocument,
  AddPlusOneMutation,
  AddPlusOneMutationVariables,
  CreateInvitationFromRsvpDocument,
  CreateInvitationFromRsvpMutation,
  CreateInvitationFromRsvpMutationVariables,
  CreatePlusOneInput,
  PublicRsvpInput,
  RemoveAllPlusOnesDocument,
  RemoveAllPlusOnesMutation,
  RemoveAllPlusOnesMutationVariables,
  RemovePlusOneDocument,
  RemovePlusOneMutation,
  RemovePlusOneMutationVariables,
  Scalars,
  UpdatePlusOneDocument,
  UpdatePlusOneInput,
  UpdatePlusOneMutation,
  UpdatePlusOneMutationVariables,
} from "@/checkpoint/generated/graphql";
import { ApolloCache } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

interface Props {}

export default function usePublicRsvpMutation({}: Props) {
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

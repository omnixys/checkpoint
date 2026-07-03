import type { ApolloCache } from "@apollo/client";
import { useMutation, type useQuery } from "@apollo/client/react";
import {
  UpdateMyProfileDocument,
  type UpdateMyProfileInput,
  type UpdateMyProfileMutation,
  type UpdateMyProfileMutationVariables,
} from "@/checkpoint/generated/graphql";

interface Payload {
  updateProfilePayload: UpdateMyProfileMutation["updateMyProfile"] | undefined;
  updateProfileLoading: ReturnType<typeof useQuery>["loading"];
  updateProfileError: ReturnType<typeof useQuery>["error"];
  updateProfile: useMutation.MutationFunction<
    UpdateMyProfileMutation,
    {
      input: UpdateMyProfileInput;
    },
    ApolloCache
  >;
}

export default function useMeMutation(): Payload {
  const [updateProfile, updateProfileMutationResult] = useMutation<
    UpdateMyProfileMutation,
    UpdateMyProfileMutationVariables
  >(UpdateMyProfileDocument);

  const updateProfilePayload = updateProfileMutationResult.data?.updateMyProfile;

  return {
    updateProfile,
    updateProfilePayload,
    updateProfileError: updateProfileMutationResult.error,
    updateProfileLoading: updateProfileMutationResult.loading,
  };
}

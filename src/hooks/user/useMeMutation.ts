import {
  MeDocument,
  MePageDocument,
  MePageQuery,
  MePageQueryVariables,
  UpdateMyProfileDocument,
  UpdateMyProfileInput,
  UpdateMyProfileMutation,
  UpdateMyProfileMutationVariables,
} from "@/checkpoint/generated/graphql";
import { ApolloCache } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import router from "next/router";

interface Props {
  loadMePage?: boolean | undefined;
}

interface Payload {
  updateProfilePayload: UpdateMyProfileMutation['updateMyProfile'] | undefined;
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
  
  const updateProfilePayload =
    updateProfileMutationResult.data?.updateMyProfile;
  
  return {
    updateProfile,
    updateProfilePayload,
    updateProfileError: updateProfileMutationResult.error,
    updateProfileLoading: updateProfileMutationResult.loading,
  };
}

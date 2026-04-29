import {
  CurrentUserDocument,
  CurrentUserQuery,
  CurrentUserQueryVariables,
  GetUserNameDocument,
  GetUserNameQuery,
  GetUserNameQueryVariables,
  MePageDocument,
  MePageQuery,
  MePageQueryVariables,
} from "@/checkpoint/generated/graphql";
import { useQuery } from "@apollo/client/react";

interface Props {
  userId: string;

  loadUserName?: boolean | undefined;
}


export default function useUserQuery({
  userId,
  loadUserName = false,
}: Props){

  const userNameQueryResult = useQuery<
    GetUserNameQuery,
    GetUserNameQueryVariables
    >(GetUserNameDocument, {
      variables: {
      id: userId
    },
      fetchPolicy: "cache-first",
    skip: !loadUserName || !userId,
  });

    const userInfo = userNameQueryResult.data?.user;

  return {
    userInfo,
    userInfoLoading: userNameQueryResult.loading,
    userInfoError: userNameQueryResult.error,
    userInfoRefetch: userNameQueryResult.refetch,
  };
}

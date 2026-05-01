import { useQuery } from "@apollo/client/react";
import {
  GetUserNameDocument,
  type GetUserNameQuery,
  type GetUserNameQueryVariables,
} from "@/checkpoint/generated/graphql";

interface Props {
  userId?: string | undefined;

  loadUserName?: boolean | undefined;
}

export default function useUserQuery({ userId, loadUserName = false }: Props) {
  const userNameQueryResult = useQuery<GetUserNameQuery, GetUserNameQueryVariables>(
    GetUserNameDocument,
    {
      variables: {
        id: userId ?? "",
      },
      fetchPolicy: "cache-first",
      skip: !loadUserName || !userId,
    },
  );

  const userInfo = userNameQueryResult.data?.user;

  return {
    userInfo,
    userInfoLoading: userNameQueryResult.loading,
    userInfoError: userNameQueryResult.error,
    userInfoRefetch: userNameQueryResult.refetch,
  };
}

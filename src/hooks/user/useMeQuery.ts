import { useQuery } from "@apollo/client/react";
import {
  CurrentUserDocument,
  type CurrentUserQuery,
  type CurrentUserQueryVariables,
  MePageDocument,
  type MePageQuery,
  type MePageQueryVariables,
} from "@/checkpoint/generated/graphql";

interface Props {
  loadMePage?: boolean | undefined;
  loadCurrentUser?: boolean | undefined;
}

export default function useMeQuery({ loadMePage = false, loadCurrentUser = false }: Props) {
  const UserInfoQueryResult = useQuery<MePageQuery, MePageQueryVariables>(MePageDocument, {
    fetchPolicy: "cache-and-network",
    skip: !loadMePage,
  });

  const mePage = UserInfoQueryResult.data?.me;

  const currentUserQueryResult = useQuery<CurrentUserQuery, CurrentUserQueryVariables>(
    CurrentUserDocument,
    {
      fetchPolicy: "cache-first",
      skip: !loadCurrentUser,
    },
  );

  const currentUser = currentUserQueryResult.data?.me;

  return {
    mePage,
    mePageLoading: UserInfoQueryResult.loading,
    mePageError: UserInfoQueryResult.error,
    mePageRefetch: UserInfoQueryResult.refetch,

    currentUser,
    currentUserLoading: currentUserQueryResult.loading,
    currentUserError: currentUserQueryResult.error,
    currentUserRefetch: currentUserQueryResult.refetch,
  };
}

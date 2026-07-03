import { useQuery } from "@apollo/client/react";
import {
  GetSubEventNameListDocument,
  type GetSubEventNameListQuery,
  type GetSubEventNameListQueryVariables,
} from "@/checkpoint/generated/graphql";

interface Props {
  eventId?: string | undefined;
  isAuthenticated?: boolean | undefined;

  loadChildrenSettings?: boolean | undefined;
}

export default function useSubEventListQuery({ eventId, loadChildrenSettings = false }: Props) {
  const subEventNameListQueryResult = useQuery<
    GetSubEventNameListQuery,
    GetSubEventNameListQueryVariables
  >(GetSubEventNameListDocument, {
    variables: { eventId: eventId! },
    fetchPolicy: "cache-and-network",
    skip: !loadChildrenSettings || !eventId,
  });
  const subEventNameList = subEventNameListQueryResult.data?.eventChildren;

  return {
    subEventNameList,
    subEventNameListLoading: subEventNameListQueryResult.loading,
    subEventNameListError: subEventNameListQueryResult.error,
    subEventNameListRefetch: subEventNameListQueryResult.refetch,
  };
}

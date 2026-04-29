
import {
  EventPageDocument,
  EventPageQuery,
  EventPageQueryVariables,
  GetFullSeatInfoListDocument,
  GetFullSeatInfoListQuery,
  GetFullSeatInfoListQueryVariables,
  GetFullSeatInfoQuery,
  GetFullSeatInfoQueryVariables,
  GetSeatInfoDocument,
  GetSeatInfoListDocument,
  GetSeatInfoListQuery,
  GetSeatInfoListQueryVariables,
  GetSeatInfoQuery,
  GetSeatInfoQueryVariables,
  RenameSectionDocument,
  RenameSectionMutation,
  RenameSectionMutationVariables,
  SeatListDocument,
  SeatListQuery,
  SeatListQueryVariables,
} from "@/checkpoint/generated/graphql";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";

interface Props {

}

export default function useSeatQuery() {

    const [renameSection, { data }] = useMutation<
      RenameSectionMutation,
      RenameSectionMutationVariables
      >(RenameSectionDocument);
  
  return {
    renameSection,
    data
  };
}

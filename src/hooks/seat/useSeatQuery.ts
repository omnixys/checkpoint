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
  SeatListDocument,
  SeatListQuery,
  SeatListQueryVariables,
} from "@/checkpoint/generated/graphql";
import { useLazyQuery, useQuery } from "@apollo/client/react";

interface Props {
  seatId?: string | undefined;
  seatIdList?: string[] | undefined;

  loadSeatInfo?: boolean | undefined;
  loadFullSeatInfo?: boolean | undefined;

  loadSeatIdList?: boolean | undefined;
  loadFullSeatIdList?: boolean | undefined;
}

export default function useSeatQuery({
  seatId,
  seatIdList,
  loadSeatInfo = false,
  loadFullSeatInfo = false,
  loadSeatIdList = false,
  loadFullSeatIdList = false,
}: Props) {
  const seatInfoQueryResult = useQuery<
    GetSeatInfoQuery,
    GetSeatInfoQueryVariables
  >(GetSeatInfoDocument, {
    variables: { seatId: seatId ?? "" },
    fetchPolicy: "cache-and-network",
    skip: !seatId || !loadSeatInfo,
  });
  const seatInfo = seatInfoQueryResult.data?.seat;

  const seatInfoListQueryResult = useQuery<
    GetSeatInfoListQuery,
    GetSeatInfoListQueryVariables
  >(GetSeatInfoListDocument, {
    variables: { seatIdList: seatIdList ?? [] },
    fetchPolicy: "cache-and-network",
    skip: !seatIdList || seatIdList.length > 0 || !loadSeatIdList,
  });
  const seatInfoList = seatInfoListQueryResult.data?.getSeatList;
  const seatMap = new Map(seatInfoList?.map((s) => [s.id, s]) ?? []);

  const fullSeatInfoQueryResult = useQuery<
    GetFullSeatInfoQuery,
    GetFullSeatInfoQueryVariables
  >(GetSeatInfoDocument, {
    variables: { seatId: seatId ?? "" },
    fetchPolicy: "cache-and-network",
    skip: !seatId || !loadFullSeatInfo,
  });
  const fullSeatInfo = fullSeatInfoQueryResult.data?.seat;

  const fullSeatInfoListQueryResult = useQuery<
    GetFullSeatInfoListQuery,
    GetFullSeatInfoListQueryVariables
  >(GetFullSeatInfoListDocument, {
    variables: { seatIdList: seatIdList ?? [] },
    fetchPolicy: "cache-and-network",
    skip: !seatIdList || seatIdList.length > 0 || !loadFullSeatIdList,
  });
  const fullSeatInfoList = fullSeatInfoListQueryResult.data?.getSeatList;
  const fullSeatMap = new Map(fullSeatInfoList?.map((s) => [s.id, s]) ?? []);

  return {
    seatInfo,
    seatInfoLoading: seatInfoQueryResult.loading,
    seatInfoError: seatInfoQueryResult.error,
    seatInfoRefetch: seatInfoQueryResult.refetch,

    seatMap,
    seatInfoList,
    seatInfoListLoading: seatInfoListQueryResult.loading,
    seatInfoListError: seatInfoListQueryResult.error,
    seatInfoListRefetch: seatInfoListQueryResult.refetch,

    fullSeatInfo,
    fullSeatInfoLoading: seatInfoQueryResult.loading,
    fullSeatInfoError: seatInfoQueryResult.error,
    fullSeatInfoRefetch: seatInfoQueryResult.refetch,

    fullSeatMap,
    fullSeatInfoList,
    fullSeatInfoListLoading: fullSeatInfoQueryResult.loading,
    fullSeatInfoListError: fullSeatInfoQueryResult.error,
    fullSeatInfoListRefetch: fullSeatInfoQueryResult.refetch,
  };
}

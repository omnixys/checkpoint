// /canvas/subscriptions/useLayoutDiff.ts
import { gql } from "@apollo/client";
import { useSubscription } from "@apollo/client/react";

const LAYOUT_DIFF = gql`
  subscription OnLayoutDiff($eventId: String!) {
    layoutDiff(eventId: $eventId) {
      diff
    }
  }
`;

export function useLayoutDiff(eventId, onApply) {
  useSubscription(LAYOUT_DIFF, {
    variables: { eventId },
    onData: ({ data }) => {
      if (!data?.data?.layoutDiff?.diff) return;
      const diff = data.data.layoutDiff.diff;
      onApply(diff);
    },
  });
}

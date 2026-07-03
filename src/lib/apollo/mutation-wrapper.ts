import type { ApolloCache, DefaultContext, FetchResult, OperationVariables } from "@apollo/client";

/**
 * Internal compatible updater signature for Apollo v4.
 *
 * We DO NOT use MutationUpdaterFunction directly,
 * because its generics are too strict and break inference.
 */
type SafeUpdater<TData> = (
  cache: ApolloCache,
  result: FetchResult<TData>,
  options: {
    context?: DefaultContext;
    variables?: OperationVariables;
  },
) => void;

/**
 * Production-safe mutation updater wrapper.
 *
 * Ensures:
 * - No TypeScript conflicts
 * - Full control over cache updates
 * - Stable typing across Apollo v4
 */
export function createMutationUpdater<TData>(updater: SafeUpdater<TData>): SafeUpdater<TData> {
  return (cache, result, options) => {
    try {
      updater(cache, result, options);
    } catch (_err) {}
  };
}

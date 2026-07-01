import { normalizeApolloError } from "@/checkpoint/errors/app-error";
import { getLogger } from "./logger";

const logger = getLogger("graphql.error");

/**
 * Gateway-specific error extension shape.
 */
/**
 * Global GraphQL error handler (Apollo v4 compatible).
 *
 * Guarantees:
 * - Always throws AppError
 * - Never returns mixed types
 * - Fully typed
 */
export function handleGraphQLError(error: unknown, contextMessage: string): never {
  const appError = normalizeApolloError(error);
  logger.error(contextMessage, appError.toLogContext());
  throw appError;
}

export { AppError } from "@/checkpoint/errors/app-error";

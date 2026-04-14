import { CombinedGraphQLErrors, CombinedProtocolErrors } from "@apollo/client/errors";
import { getLogger } from "./logger";

const logger = getLogger("graphql.error");

/**
 * Gateway-specific error extension shape.
 */
export interface GatewayGraphQLErrorExtension {
  code?: string;
  serviceName?: string;
  stacktrace?: string[];
  originalError?: {
    message?: string;
    error?: string;
    statusCode?: number;
  };
  status?: number;
}

/**
 * Normalized application error.
 */
export class AppError extends Error {
  public readonly status: number | "UNKNOWN";
  public readonly code?: string | undefined;

  constructor(message: string, status: number | "UNKNOWN", code?: string) {
    super(message);
    this.status = status;
    this.code = code ?? undefined;
  }
}

function normalizeStatus(status: unknown): number | "UNKNOWN" {
  if (typeof status === "number") {
    return status;
  }

  if (typeof status === "string") {
    const parsed = Number(status);

    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return "UNKNOWN";
}

/**
 * Extracts meaningful error data from GraphQL error.
 */
function extractGraphQLError(error: CombinedGraphQLErrors) {
  const first = error.errors[0];
  const extensions = first?.extensions as GatewayGraphQLErrorExtension;

  const rawStatus = extensions?.status ?? extensions?.originalError?.statusCode;

  const status = normalizeStatus(rawStatus);

  const message = first?.message ?? extensions?.originalError?.message ?? "Unknown GraphQL error";

  const code = extensions?.code;

  return { message, status, code };
}

/**
 * Global GraphQL error handler (Apollo v4 compatible).
 *
 * Guarantees:
 * - Always throws AppError
 * - Never returns mixed types
 * - Fully typed
 */
export function handleGraphQLError(error: unknown, contextMessage: string): never {
  /**
   * GraphQL errors (resolver errors)
   */
  if (error instanceof CombinedGraphQLErrors) {
    const { message, status, code } = extractGraphQLError(error);

    logger.error(`${contextMessage} - GraphQL: ${message} (${status})`);

    throw new AppError(message, status, code);
  }

  /**
   * Network / transport errors
   */
  if (error instanceof CombinedProtocolErrors) {
    logger.error(`${contextMessage} - Network: ${error.message}`);

    throw new AppError(error.message, "UNKNOWN");
  }

  /**
   * Generic JS errors
   */
  if (error instanceof Error) {
    logger.error(`${contextMessage} - Error: ${error.message}`);

    throw new AppError(error.message, "UNKNOWN");
  }

  /**
   * Unknown error fallback
   */
  logger.error(`${contextMessage} - Unknown error`);

  throw new AppError("An unknown error occurred", "UNKNOWN");
}

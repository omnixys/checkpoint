import { GraphQLError } from "graphql";
import { getLogger } from "./logger";

const logger = getLogger("graphQl.error.ts");

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

export interface GatewayGraphQLError {
  message: string;
  path?: string[];
  extensions?: GatewayGraphQLErrorExtension;
}

export interface GatewayGraphQLResponse<T> {
  data: T | null;
  errors?: GatewayGraphQLError[];
}

/**
 * Global GraphQL error handler for Apollo Client 4.
 * No deprecated ApolloError class is used.
 */
export function handleGraphQLError(error: unknown, message: string) {
  if (typeof error === "object" && error !== null && "graphQLErrors" in error) {
    const gqlErrors = (error as any).graphQLErrors as
      | GraphQLError[]
      | undefined;
    const first = gqlErrors?.[0];
    const extensions = first?.extensions as
      | GatewayGraphQLErrorExtension
      | undefined;

    const status =
      extensions?.status ?? extensions?.originalError?.statusCode ?? "UNKNOWN";

    const originalMessage =
      first?.message ??
      extensions?.originalError?.message ??
      "Unknown GraphQL error";

    logger.error(
      `${message} - GraphQL error: ${originalMessage} (status: ${status})`
    );

    throw new Error(`${originalMessage} (status: ${status})`);
  }

  if (typeof error === "object" && error !== null && "networkError" in error) {
    const netErr = (error as any).networkError;

    logger.error(`${message} - Network error: ${netErr?.message}`);
    throw new Error(`${message}: ${netErr?.message}`);
  }

  if (error instanceof Error) {
    logger.error(`${message} - Error: ${error.message}`);
    // throw new Error(`${message}: ${error.message}`);
    return error.message;
  }

  logger.error(`${message} - Unknown error`);
  throw new Error("An unknown error occurred.");
}

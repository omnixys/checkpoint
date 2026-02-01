import { getResetToken } from "@/app/checkpoint/(authentication)/password-reset/SecurityQuestionStep";
import { getLogger } from "@/utils/logger";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Observable,
} from "@apollo/client";

export function createHttpApolloClient(token1?: string) {
  const logger = getLogger("createHttpApolloClient");
  const httpUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL!;

  // 1. Auth Link
  const authLink = new ApolloLink((operation, forward) => {
    const oldHeaders = operation.getContext().headers || {};

    const token = getResetToken();
    const headers = {
      ...oldHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    operation.setContext({ headers });

    return forward(operation);
  });

  // 2. Error Logger Link
  const errorLoggerLink = new ApolloLink((operation, forward) => {
    return new Observable((observer) => {
      const sub = forward(operation).subscribe({
        next: (value) => observer.next(value),
        error: (err) => {
          logger.error("[GraphQL Error]", err);
          observer.error(err);
        },
        complete: () => observer.complete(),
      });

      return () => sub.unsubscribe();
    });
  });

  // 3. Human-readable Network Logger
  const loggerLink = new ApolloLink((operation, forward) => {
    logger.debug("[HTTP] →", operation.operationName, operation.variables);
    return new Observable((observer) => {
      const sub = forward(operation).subscribe({
        next: (value) => {
          logger.debug("[HTTP] ←", operation.operationName, value);

          observer.next(value);
        },
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      });

      return () => sub.unsubscribe();
    });
  });

  // 4. HttpLink
  const httpLink = new HttpLink({
    uri: httpUrl,
    credentials: "include",
  });

  // Compose
  const link = ApolloLink.from([
    authLink,
    errorLoggerLink,
    loggerLink,
    httpLink,
  ]);

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
}

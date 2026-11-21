import type { GraphQLFormattedError } from 'graphql';

const SAFE_CODES = new Set([
  'BAD_USER_INPUT',
  'BAD_REQUEST',
  'GRAPHQL_VALIDATION_FAILED',
  'GRAPHQL_PARSE_FAILED',
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'TOO_MANY_REQUESTS',
]);

/**
 * Central GraphQL error formatter.
 * In production, unexpected errors are masked so internal details never reach clients.
 */
export function formatGraphQLError(
  formatted: GraphQLFormattedError,
  _error: unknown,
  isProduction: boolean,
): GraphQLFormattedError {
  const code =
    typeof formatted.extensions?.code === 'string'
      ? formatted.extensions.code
      : 'INTERNAL_SERVER_ERROR';

  if (isProduction && !SAFE_CODES.has(code)) {
    return {
      message: 'Internal server error',
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    };
  }

  return formatted;
}

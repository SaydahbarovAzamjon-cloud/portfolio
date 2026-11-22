import { Logger } from '@nestjs/common';
import type { GraphQLFormattedError } from 'graphql';

const logger = new Logger('GraphQL');

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
 * Nest only maps 400/401/403/422 to GraphQL codes; everything else arrives as
 * INTERNAL_SERVER_ERROR with `extensions.status`. Give those a proper code.
 */
const STATUS_CODES: Record<number, string> = {
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  429: 'TOO_MANY_REQUESTS',
};

/**
 * Central GraphQL error formatter.
 * In production, unexpected errors are masked so internal details never reach clients.
 */
export function formatGraphQLError(
  formatted: GraphQLFormattedError,
  _error: unknown,
  isProduction: boolean,
): GraphQLFormattedError {
  const extensions = formatted.extensions ?? {};
  const status =
    typeof extensions.status === 'number' ? extensions.status : undefined;
  const code =
    (status !== undefined ? STATUS_CODES[status] : undefined) ??
    (typeof extensions.code === 'string'
      ? extensions.code
      : 'INTERNAL_SERVER_ERROR');

  // Validation errors carry the real reasons in an array: show them, not "Bad Request Exception".
  const details = (extensions.originalError as { message?: unknown })?.message;
  const message = Array.isArray(details)
    ? details.join(', ')
    : formatted.message;

  // Print the error in red (dev: every error, production: only unexpected ones).
  if (!isProduction || !SAFE_CODES.has(code)) {
    const where = formatted.path?.join('.') ?? 'request';
    logger.error(`✖ ${where} [${code}] ${message}`);
  }

  if (isProduction && !SAFE_CODES.has(code)) {
    return {
      message: 'Internal server error',
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    };
  }

  // Short and clean for the client (details are already in the terminal).
  return {
    message,
    path: formatted.path,
    extensions: { code },
  };
}

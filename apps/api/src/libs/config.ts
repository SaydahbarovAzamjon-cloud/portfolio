/** Shared helpers and constants (nestar style: libs/config.ts). */

const WORDS_PER_MINUTE = 200;

/** Reading time in minutes for a markdown/plain text body. */
export const readingMinutes = (text?: string): number | undefined => {
  if (!text) return undefined;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
};

/** URL-safe slug: "Next.js" → "nextjs", "REST APIs" → "rest-apis", "C++" → "cplusplus". */
export const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/#/g, 'sharp')
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** MongoDB duplicate key error (unique index). */
export const isDuplicateKeyError = (err: unknown): boolean =>
  (err as { code?: number })?.code === 11000;

// AUTH COOKIES
export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';

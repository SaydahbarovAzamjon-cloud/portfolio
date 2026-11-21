/** Shared helpers (nestar style: libs/config.ts). */

const WORDS_PER_MINUTE = 200;

/** Reading time in minutes for a markdown/plain text body. */
export const readingMinutes = (text?: string): number | undefined => {
  if (!text) return undefined;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
};

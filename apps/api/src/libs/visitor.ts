import { randomUUID } from 'node:crypto';
import type { Response } from 'express';
import { VISITOR_COOKIE } from './config';
import type { AuthRequest } from './types/auth';

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Anonymous visitor id from the cookie, or null if there is none yet. */
export const readVisitorId = (req: AuthRequest): string | null => {
  const id = req.cookies?.[VISITOR_COOKIE];
  return id && UUID_PATTERN.test(id) ? id : null;
};

/** Anonymous visitor id; creates one (random, 1 year cookie) when missing. */
export const ensureVisitorId = (req: AuthRequest, res: Response): string => {
  const existing = readVisitorId(req);
  if (existing) return existing;

  const id = randomUUID();
  res.cookie(VISITOR_COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ONE_YEAR_MS,
  });
  return id;
};

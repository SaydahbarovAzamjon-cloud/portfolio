import type { Request, Response } from 'express';
import { UserRole } from '../enums/user.enum';

/** Data stored inside the access token (JWT). */
export interface AccessTokenPayload {
  /** User id */
  sub: string;
  role: UserRole;
  /** Session id: lets logout invalidate the access token immediately. */
  sid: string;
}

/** The logged-in user, attached to the request by the auth guards. */
export interface AuthUser {
  _id: string;
  role: UserRole;
  sessionId: string;
}

export interface AuthRequest extends Request {
  cookies: Record<string, string | undefined>;
  authUser?: AuthUser | null;
}

/** GraphQL context built in graphql.module.ts. */
export interface GqlContext {
  req: AuthRequest;
  res: Response;
}

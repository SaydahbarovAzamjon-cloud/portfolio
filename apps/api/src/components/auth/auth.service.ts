import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { hash, verify } from '@node-rs/argon2';
import type { CookieOptions, Response } from 'express';
import { Model, Types } from 'mongoose';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../../libs/config';
import type {
  AccessTokenPayload,
  AuthRequest,
  AuthUser,
} from '../../libs/types/auth';
import { AuthSession } from '../../schemas/AuthSession.model';

/** Helpers only: passwords, tokens, sessions, cookies. Login logic lives in UserService. */
@Injectable()
export class AuthService {
  private readonly accessTtlMs: number;
  private readonly refreshTtlMs: number;
  private readonly secureCookies: boolean;

  constructor(
    @InjectModel('AuthSession')
    private readonly sessionModel: Model<AuthSession>,
    private readonly jwtService: JwtService,
    config: ConfigService,
  ) {
    this.accessTtlMs =
      config.getOrThrow<number>('ACCESS_TOKEN_TTL_MINUTES') * 60_000;
    this.refreshTtlMs =
      config.getOrThrow<number>('REFRESH_TOKEN_TTL_DAYS') * 86_400_000;
    this.secureCookies = config.get<string>('NODE_ENV') === 'production';
  }

  // PASSWORD

  public async hashPassword(password: string): Promise<string> {
    return await hash(password);
  }

  public async comparePassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    try {
      return await verify(passwordHash, password);
    } catch {
      return false;
    }
  }

  // ACCESS TOKEN (JWT)

  public async createToken(payload: AccessTokenPayload): Promise<string> {
    return await this.jwtService.signAsync({ ...payload });
  }

  public async verifyToken(token: string): Promise<AccessTokenPayload | null> {
    try {
      return await this.jwtService.verifyAsync<AccessTokenPayload>(token);
    } catch {
      return null;
    }
  }

  // REFRESH SESSION

  /** Creates a session and returns its refresh token: "<sessionId>.<secret>". */
  public async createSession(
    userId: Types.ObjectId,
    req: AuthRequest,
  ): Promise<{ sessionId: string; refreshToken: string }> {
    const secret = this.newSecret();
    const session = await this.sessionModel.create({
      userId,
      refreshTokenHash: this.sha256(secret),
      userAgent: req.headers['user-agent']?.slice(0, 300),
      ipHash: req.ip ? this.sha256(req.ip) : undefined,
      expiresAt: new Date(Date.now() + this.refreshTtlMs),
    });
    const sessionId = session._id.toString();
    return { sessionId, refreshToken: `${sessionId}.${secret}` };
  }

  /**
   * Checks the refresh token and replaces it with a new one.
   * Returns null if invalid. Re-using an old token revokes ALL sessions of that user.
   */
  public async rotateSession(refreshToken?: string): Promise<{
    userId: string;
    sessionId: string;
    refreshToken: string;
  } | null> {
    const parsed = this.parseRefreshToken(refreshToken);
    if (!parsed) return null;

    const session = await this.sessionModel
      .findById(parsed.sessionId)
      .select('+refreshTokenHash')
      .exec();
    if (!session || session.revokedAt || session.expiresAt <= new Date()) {
      return null;
    }

    if (!this.safeEqual(session.refreshTokenHash, this.sha256(parsed.secret))) {
      await this.revokeAllSessions(session.userId);
      return null;
    }

    const secret = this.newSecret();
    session.refreshTokenHash = this.sha256(secret);
    session.expiresAt = new Date(Date.now() + this.refreshTtlMs);
    await session.save();

    const sessionId = session._id.toString();
    return {
      userId: session.userId.toString(),
      sessionId,
      refreshToken: `${sessionId}.${secret}`,
    };
  }

  public async revokeSession(refreshToken?: string): Promise<void> {
    const parsed = this.parseRefreshToken(refreshToken);
    if (!parsed) return;
    await this.sessionModel
      .updateOne(
        { _id: parsed.sessionId, revokedAt: { $exists: false } },
        { revokedAt: new Date() },
      )
      .exec();
  }

  public async revokeAllSessions(userId: Types.ObjectId): Promise<void> {
    await this.sessionModel
      .updateMany(
        { userId, revokedAt: { $exists: false } },
        { revokedAt: new Date() },
      )
      .exec();
  }

  // COOKIES

  /** Puts both tokens into httpOnly cookies and returns the access-token expiry. */
  public setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): Date {
    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      ...this.cookieOptions(),
      maxAge: this.accessTtlMs,
    });
    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...this.cookieOptions(),
      maxAge: this.refreshTtlMs,
    });
    return new Date(Date.now() + this.accessTtlMs);
  }

  public clearAuthCookies(res: Response): void {
    res.clearCookie(ACCESS_TOKEN_COOKIE, this.cookieOptions());
    res.clearCookie(REFRESH_TOKEN_COOKIE, this.cookieOptions());
  }

  // USED BY GUARDS

  /** Returns the logged-in user from the access-token cookie, or null. */
  public async authenticate(req: AuthRequest): Promise<AuthUser | null> {
    const token = req.cookies?.[ACCESS_TOKEN_COOKIE];
    if (!token) return null;

    const payload = await this.verifyToken(token);
    if (!payload) return null;

    // Session must still be active, so logout takes effect immediately.
    const active = await this.sessionModel
      .exists({
        _id: payload.sid,
        revokedAt: { $exists: false },
        expiresAt: { $gt: new Date() },
      })
      .exec();
    if (!active) return null;

    return { _id: payload.sub, role: payload.role, sessionId: payload.sid };
  }

  // PRIVATE

  private cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.secureCookies,
      sameSite: 'lax',
      path: '/',
    };
  }

  private parseRefreshToken(
    token?: string,
  ): { sessionId: string; secret: string } | null {
    if (!token) return null;
    const [sessionId, secret] = token.split('.');
    if (!sessionId || !secret || !Types.ObjectId.isValid(sessionId)) {
      return null;
    }
    return { sessionId, secret };
  }

  private newSecret(): string {
    return randomBytes(48).toString('base64url');
  }

  private sha256(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }

  private safeEqual(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
  }
}

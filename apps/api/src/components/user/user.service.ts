import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Response } from 'express';
import { Model } from 'mongoose';
import { REFRESH_TOKEN_COOKIE } from '../../libs/config';
import { Admin, AuthPayload } from '../../libs/dto/auth/auth';
import { LoginInput } from '../../libs/dto/auth/auth.input';
import { Message } from '../../libs/enums/common.enum';
import { UserRole } from '../../libs/enums/user.enum';
import type { AuthRequest } from '../../libs/types/auth';
import { User } from '../../schemas/User.model';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  /** Checked when the email does not exist, so both cases take the same time. */
  private readonly dummyHash: Promise<string>;

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly authService: AuthService,
  ) {
    this.dummyHash = this.authService.hashPassword('dummy-password-for-timing');
  }

  public async login(
    input: LoginInput,
    req: AuthRequest,
    res: Response,
  ): Promise<AuthPayload> {
    const { email, password } = input;

    // 1. Find the user (passwordHash is hidden by default)
    const user = await this.userModel
      .findOne({ email: email.toLowerCase().trim() })
      .select('+passwordHash')
      .exec();

    // 2. Check the password
    const isMatch = await this.authService.comparePassword(
      password,
      user?.passwordHash ?? (await this.dummyHash),
    );
    if (!user || !isMatch) {
      this.logger.warn(`Failed login attempt: ${email}`);
      throw new UnauthorizedException(Message.WRONG_CREDENTIALS);
    }

    // 3. Create a session + tokens, put them in cookies
    const { sessionId, refreshToken } = await this.authService.createSession(
      user._id,
      req,
    );
    const accessToken = await this.authService.createToken({
      sub: user._id.toString(),
      role: user.role,
      sid: sessionId,
    });
    const accessTokenExpiresAt = this.authService.setAuthCookies(
      res,
      accessToken,
      refreshToken,
    );

    // 4. Remember the login time
    await this.userModel
      .updateOne({ _id: user._id }, { lastLoginAt: new Date() })
      .exec();
    this.logger.log(`Admin logged in: ${user.email}`);

    const admin = await this.getAdmin(user._id.toString());
    return { message: Message.LOGIN_SUCCESS, admin, accessTokenExpiresAt };
  }

  public async refreshToken(
    req: AuthRequest,
    res: Response,
  ): Promise<AuthPayload> {
    // 1. Check + rotate the refresh token
    const session = await this.authService.rotateSession(
      req.cookies[REFRESH_TOKEN_COOKIE],
    );
    if (!session) {
      this.authService.clearAuthCookies(res);
      throw new UnauthorizedException(Message.SESSION_EXPIRED);
    }

    // 2. New access token
    const admin = await this.getAdmin(session.userId);
    const accessToken = await this.authService.createToken({
      sub: admin._id,
      role: admin.role,
      sid: session.sessionId,
    });
    const accessTokenExpiresAt = this.authService.setAuthCookies(
      res,
      accessToken,
      session.refreshToken,
    );

    return { message: Message.SESSION_REFRESHED, admin, accessTokenExpiresAt };
  }

  public async logout(req: AuthRequest, res: Response): Promise<boolean> {
    await this.authService.revokeSession(req.cookies[REFRESH_TOKEN_COOKIE]);
    this.authService.clearAuthCookies(res);
    return true;
  }

  public async getAdmin(userId: string): Promise<Admin> {
    const user = await this.userModel.findById(userId).lean().exec();
    if (!user) throw new NotFoundException(Message.NO_DATA_FOUND);

    return {
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      lastLoginAt: user.lastLoginAt ?? undefined,
    };
  }

  /*** SEED (scripts/seed-admin.ts) ***/

  /** Creates the single admin, or resets its password. Refuses a second admin. */
  public async upsertAdmin(
    email: string,
    password: string,
  ): Promise<'created' | 'updated'> {
    const normalized = email.toLowerCase().trim();
    const passwordHash = await this.authService.hashPassword(password);
    const existing = await this.userModel
      .findOne({ role: UserRole.ADMIN })
      .exec();

    if (existing && existing.email !== normalized) {
      throw new Error(
        `Another admin already exists (${existing.email}). Only one admin is allowed.`,
      );
    }

    if (existing) {
      await this.userModel
        .updateOne({ _id: existing._id }, { passwordHash })
        .exec();
      return 'updated';
    }

    await this.userModel.create({
      email: normalized,
      passwordHash,
      role: UserRole.ADMIN,
    });
    return 'created';
  }
}

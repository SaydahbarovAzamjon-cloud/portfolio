import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { randomInt } from 'node:crypto';
import type { Response } from 'express';
import { Model, Types } from 'mongoose';
import { REFRESH_TOKEN_COOKIE } from '../../libs/config';
import { Admin, AuthPayload, MessageResult } from '../../libs/dto/auth/auth';
import {
  ChangePasswordInput,
  LoginInput,
} from '../../libs/dto/auth/auth.input';
import { Message } from '../../libs/enums/common.enum';
import { UserRole } from '../../libs/enums/user.enum';
import type { AuthRequest } from '../../libs/types/auth';
import { User } from '../../schemas/User.model';
import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../notification/notification.service';

const CODE_TTL_MS = 10 * 60 * 1000;
const CODE_MAX_ATTEMPTS = 5;

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  /** Checked when the email does not exist, so both cases take the same time. */
  private readonly dummyHash: Promise<string>;

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly config: ConfigService,
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

  /*** ADMIN ***/

  /** Step 1: a 6-digit code goes ONLY to the owner's email (MAIL_TO in .env). */
  public async requestPasswordCodeByAdmin(
    userId: string,
  ): Promise<MessageResult> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException(Message.NO_DATA_FOUND);

    // 1. new code (replaces any old one), only its hash is stored
    const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
    await this.userModel
      .updateOne(
        { _id: user._id },
        {
          passwordCode: {
            hash: await this.authService.hashPassword(code),
            expiresAt: new Date(Date.now() + CODE_TTL_MS),
            attempts: 0,
          },
        },
      )
      .exec();

    // 2. send it
    const error = await this.notificationService.sendEmail({
      subject: `Portfolio admin: password change code ${code}`,
      text: [
        `Your confirmation code: ${code}`,
        '',
        'It is valid for 10 minutes and works only once.',
        'If you did not ask to change the admin password, someone may have your current password: change it right away.',
      ].join('\n'),
    });
    if (error) {
      await this.clearPasswordCode(user._id);
      throw new BadRequestException(Message.EMAIL_SEND_FAILED);
    }

    this.logger.log(`Password code sent to ${this.maskedOwnerEmail()}`);
    return { message: Message.CODE_SENT };
  }

  /** Step 2: new password. Needs the current password and the emailed code. */
  public async changePasswordByAdmin(
    userId: string,
    sessionId: string,
    input: ChangePasswordInput,
  ): Promise<MessageResult> {
    const user = await this.userModel
      .findById(userId)
      .select('+passwordHash +passwordCode')
      .exec();
    if (!user) throw new NotFoundException(Message.NO_DATA_FOUND);

    // 1. check the emailed code (5 wrong tries → the code is cancelled)
    const saved = user.passwordCode;
    if (!saved || saved.expiresAt.getTime() < Date.now()) {
      await this.clearPasswordCode(user._id);
      throw new BadRequestException(Message.CODE_EXPIRED);
    }
    const codeMatch = await this.authService.comparePassword(
      input.code,
      saved.hash,
    );
    if (!codeMatch) {
      const attempts = (saved.attempts ?? 0) + 1;
      if (attempts >= CODE_MAX_ATTEMPTS) {
        await this.clearPasswordCode(user._id);
        throw new BadRequestException(Message.CODE_EXPIRED);
      }
      await this.userModel
        .updateOne({ _id: user._id }, { 'passwordCode.attempts': attempts })
        .exec();
      throw new BadRequestException(Message.CODE_INVALID);
    }

    // 2. check the current password
    const isMatch = await this.authService.comparePassword(
      input.currentPassword,
      user.passwordHash,
    );
    if (!isMatch) {
      this.logger.warn(`Wrong current password: ${user.email}`);
      throw new BadRequestException(Message.WRONG_CURRENT_PASSWORD);
    }
    if (input.newPassword === input.currentPassword) {
      throw new BadRequestException(Message.SAME_PASSWORD);
    }

    // 3. save the new password, the code is used up
    const passwordHash = await this.authService.hashPassword(input.newPassword);
    await this.userModel
      .updateOne(
        { _id: user._id },
        { $set: { passwordHash }, $unset: { passwordCode: 1 } },
      )
      .exec();

    // 4. log out every other device, tell the owner
    await this.authService.revokeAllSessions(user._id, sessionId);
    this.logger.log(`Password changed: ${user.email}`);
    void this.notificationService.sendTelegram(
      [
        '🔐 Admin password was changed. Other devices were logged out.',
        `New password hint: ${this.passwordHint(input.newPassword)}`,
      ].join('\n'),
    );

    return { message: Message.PASSWORD_CHANGED };
  }

  private async clearPasswordCode(userId: Types.ObjectId): Promise<void> {
    await this.userModel
      .updateOne({ _id: userId }, { $unset: { passwordCode: 1 } })
      .exec();
  }

  /** Only the first and last character: "Secret-pass1" → "S**********1 (12 characters)". */
  private passwordHint(password: string): string {
    const middle = '*'.repeat(Math.max(password.length - 2, 0));
    return `${password[0]}${middle}${password[password.length - 1]} (${password.length} characters)`;
  }

  /** "s***@gmail.com" for logs. */
  private maskedOwnerEmail(): string {
    const email = this.config.get<string>('MAIL_TO') ?? '';
    const [name, domain] = email.split('@');
    return name && domain ? `${name[0]}***@${domain}` : 'owner email';
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

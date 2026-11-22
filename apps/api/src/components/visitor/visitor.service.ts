import { randomUUID } from 'node:crypto';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import type { Response } from 'express';
import { Model } from 'mongoose';
import { VISIT_SESSION_COOKIE } from '../../libs/config';
import { TrackVisitResult } from '../../libs/dto/visitor/visitor';
import { TrackVisitInput } from '../../libs/dto/visitor/visitor.input';
import { Locale, Message } from '../../libs/enums/common.enum';
import type { AuthRequest } from '../../libs/types/auth';
import { DeviceInfo, isBot, readDevice } from '../../libs/user-agent';
import { ensureVisitorId } from '../../libs/visitor';
import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../notification/notification.service';

/** A visit ends after 30 minutes without opening a page. */
const SESSION_MS = 30 * 60 * 1000;

interface VisitorDoc {
  visitorId: string;
  firstSeenAt: Date;
  lastSeenAt: Date;
  visitCount: number;
  firstReferrer?: string;
  locale?: string;
  device?: DeviceInfo;
}

interface PageViewDoc {
  visitorId: string;
  sessionId: string;
  path: string;
  locale: Locale;
  pageType: string;
  entityId?: string;
  referrer?: string;
}

@Injectable()
export class VisitorService {
  private readonly logger = new Logger(VisitorService.name);

  constructor(
    @InjectModel('Visitor') private readonly visitorModel: Model<VisitorDoc>,
    @InjectModel('PageView') private readonly pageViewModel: Model<PageViewDoc>,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly config: ConfigService,
  ) {}

  /** Saves a page view. The first page of a visit sends a Telegram alert. */
  public async trackVisit(
    input: TrackVisitInput,
    req: AuthRequest,
    res: Response,
  ): Promise<TrackVisitResult> {
    const userAgent = req.headers['user-agent'];

    // 1. ignore bots and the logged-in admin (you looking at your own site)
    if (isBot(userAgent)) return { message: Message.VISIT_SAVED };
    if (await this.authService.authenticate(req)) {
      return { message: Message.VISIT_SAVED };
    }

    // 2. who is it, and is this the start of a new visit
    const visitorId = ensureVisitorId(req, res);
    const oldSessionId = req.cookies?.[VISIT_SESSION_COOKIE];
    const isNewVisit = !oldSessionId;
    const sessionId = oldSessionId ?? randomUUID();
    res.cookie(VISIT_SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SESSION_MS,
    });

    // 3. save the visitor and the page view
    const locale = input.locale ?? Locale.EN;
    const device = readDevice(userAgent);
    const visitor = await this.saveVisitor(
      visitorId,
      isNewVisit,
      input,
      device,
    );
    await this.pageViewModel.create({
      visitorId,
      sessionId,
      path: input.path,
      locale,
      pageType: input.pageType,
      entityId: input.entityId,
      referrer: input.referrer || undefined,
    });

    // 4. tell the owner a visit started (does not wait)
    if (isNewVisit && this.config.get<boolean>('TELEGRAM_NOTIFY_VISITS')) {
      const title =
        visitor.visitCount === 1
          ? '👀 New visitor'
          : `🔁 Returning visitor (visit #${visitor.visitCount})`;
      void this.notificationService.sendTelegram(
        [
          title,
          `Page: ${input.path}`,
          `From: ${this.describeReferrer(input.referrer)}`,
          `Device: ${device.type.toLowerCase()} · ${device.os} · ${device.browser}`,
          `Language: ${locale}`,
        ].join('\n'),
      );
    }

    return { message: Message.VISIT_SAVED };
  }

  /*** HELPERS ***/

  /** Creates the visitor, or updates last seen (+1 visit when a new visit starts). */
  private async saveVisitor(
    visitorId: string,
    isNewVisit: boolean,
    input: TrackVisitInput,
    device: DeviceInfo,
  ): Promise<VisitorDoc> {
    const now = new Date();
    const result = await this.visitorModel
      .findOneAndUpdate(
        { visitorId },
        {
          $set: { lastSeenAt: now },
          $inc: { visitCount: isNewVisit ? 1 : 0 },
          $setOnInsert: {
            firstSeenAt: now,
            firstReferrer: input.referrer || undefined,
            locale: input.locale ?? Locale.EN,
            device,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: false },
      )
      .lean()
      .exec();

    if (!result) {
      this.logger.error(`saveVisitor: no result for ${visitorId}`);
      throw new Error(Message.SOMETHING_WENT_WRONG);
    }
    return result;
  }

  private describeReferrer(referrer?: string): string {
    if (!referrer) return 'direct';
    try {
      return new URL(referrer).hostname;
    } catch {
      return 'unknown';
    }
  }
}

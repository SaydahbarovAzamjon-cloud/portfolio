import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Response } from 'express';
import { isValidObjectId, Model } from 'mongoose';
import {
  ContactMessage,
  ContactMessageResult,
  ContactMessages,
  ContactSendResult,
} from '../../libs/dto/contact/contact';
import {
  ContactInput,
  ContactMessagesInquiry,
} from '../../libs/dto/contact/contact.input';
import { ContactStatusUpdate } from '../../libs/dto/contact/contact.update';
import { Message } from '../../libs/enums/common.enum';
import { ContactMessageStatus } from '../../libs/enums/contact.enum';
import type { AuthRequest } from '../../libs/types/auth';
import { ensureVisitorId } from '../../libs/visitor';
import { NotificationService } from '../notification/notification.service';

/** Stored message: public fields + private ones (never exposed). */
type ContactDoc = ContactMessage & { visitorId?: string; userAgent?: string };

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectModel('ContactMessage')
    private readonly contactModel: Model<ContactDoc>,
    private readonly notificationService: NotificationService,
  ) {}

  /** Visitor sends the "Get In Touch" form. */
  public async sendContactMessage(
    input: ContactInput,
    req: AuthRequest,
    res: Response,
  ): Promise<ContactSendResult> {
    const { website, ...fields } = input;

    // 1. bot filled the hidden field: pretend success, save nothing
    if (website) {
      this.logger.warn(`Spam blocked (honeypot) from ${input.email}`);
      return { message: Message.CONTACT_SENT };
    }

    // 2. save
    const saved = await this.contactModel.create({
      ...fields,
      status: ContactMessageStatus.NEW,
      visitorId: ensureVisitorId(req, res),
      userAgent: req.headers['user-agent']?.slice(0, 300),
    });

    // 3. notify the owner in the background (the visitor does not wait)
    void this.deliver(saved.toObject());

    return { message: Message.CONTACT_SENT };
  }

  /*** ADMIN ***/

  /** Inbox, newest first. */
  public async getContactMessagesByAdmin(
    input: ContactMessagesInquiry,
  ): Promise<ContactMessages> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;
    const match = input.status ? { status: input.status } : {};

    const [result] = await this.contactModel
      .aggregate<ContactMessages>([
        { $match: match },
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            list: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              { $project: { visitorId: 0, userAgent: 0, ipHash: 0 } },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    return result ?? { list: [], metaCounter: [] };
  }

  /** Opens one message; a NEW message becomes READ. */
  public async getContactMessageByAdmin(
    messageId: string,
  ): Promise<ContactMessage> {
    if (!isValidObjectId(messageId)) {
      throw new BadRequestException(Message.BAD_REQUEST);
    }

    const found = await this.contactModel.findById(messageId).lean().exec();
    if (!found) throw new NotFoundException(Message.NO_DATA_FOUND);

    if (found.status === ContactMessageStatus.NEW) {
      await this.contactModel
        .updateOne(
          { _id: messageId },
          { $set: { status: ContactMessageStatus.READ } },
        )
        .exec();
      found.status = ContactMessageStatus.READ;
    }

    return found;
  }

  public async updateContactMessageStatusByAdmin(
    input: ContactStatusUpdate,
  ): Promise<ContactMessageResult> {
    const result = await this.contactModel
      .findByIdAndUpdate(
        input._id,
        { $set: { status: input.status } },
        { new: true },
      )
      .lean()
      .exec();
    if (!result) throw new NotFoundException(Message.NO_DATA_FOUND);

    return { message: Message.UPDATE_SUCCESS, data: result };
  }

  public async removeContactMessageByAdmin(
    messageId: string,
  ): Promise<ContactMessageResult> {
    if (!isValidObjectId(messageId)) {
      throw new BadRequestException(Message.BAD_REQUEST);
    }

    const result = await this.contactModel
      .findByIdAndDelete(messageId)
      .lean()
      .exec();
    if (!result) throw new NotFoundException(Message.NO_DATA_FOUND);

    return { message: Message.REMOVE_SUCCESS, data: result };
  }

  /*** HELPERS ***/

  /** Telegram + email to the owner; records what was delivered. */
  private async deliver(msg: ContactMessage): Promise<void> {
    const text = [
      `✉️ New message: ${msg.subject}`,
      `From: ${msg.name} <${msg.email}>`,
      `Language: ${msg.locale}`,
      '',
      msg.message,
    ].join('\n');

    const [telegramError, emailError] = await Promise.all([
      this.notificationService.sendTelegram(text),
      this.notificationService.sendEmail({
        subject: `Portfolio contact: ${msg.subject}`,
        text,
        replyTo: msg.email,
      }),
    ]);

    const now = new Date();
    const errors = [telegramError, emailError].filter(Boolean).join('; ');
    await this.contactModel
      .updateOne(
        { _id: msg._id },
        {
          $set: {
            ...(telegramError ? {} : { 'delivery.telegramSentAt': now }),
            ...(emailError ? {} : { 'delivery.emailSentAt': now }),
            ...(errors ? { 'delivery.lastError': errors } : {}),
          },
        },
      )
      .exec()
      .catch((err: Error) => this.logger.error(`deliver: ${err.message}`));
  }
}

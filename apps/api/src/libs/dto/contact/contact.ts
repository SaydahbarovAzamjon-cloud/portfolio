import { Field, ObjectType } from '@nestjs/graphql';
import type { Types } from 'mongoose';
import { Locale } from '../../enums/common.enum';
import { ContactMessageStatus } from '../../enums/contact.enum';
import { TotalCounter } from '../common/common';

/** Was the owner notified, and if not, why. */
@ObjectType()
export class ContactDelivery {
  @Field(() => Date, { nullable: true })
  emailSentAt?: Date;

  @Field(() => Date, { nullable: true })
  telegramSentAt?: Date;

  @Field(() => String, { nullable: true })
  lastError?: string;
}

@ObjectType()
export class ContactMessage {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  subject: string;

  @Field(() => String)
  message: string;

  @Field(() => Locale)
  locale: Locale;

  @Field(() => ContactMessageStatus)
  status: ContactMessageStatus;

  /** admin only **/
  @Field(() => ContactDelivery, { nullable: true })
  delivery?: ContactDelivery;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class ContactMessages {
  @Field(() => [ContactMessage])
  list: ContactMessage[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}

/** Visitor's form result: only the success text. */
@ObjectType()
export class ContactSendResult {
  @Field(() => String)
  message: string;
}

@ObjectType()
export class ContactMessageResult {
  @Field(() => String)
  message: string;

  @Field(() => ContactMessage)
  data: ContactMessage;
}

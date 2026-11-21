import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ContactMessageStatus } from '../libs/enums/contact.enum';
import { Locale } from '../libs/enums/common.enum';

@Schema({ _id: false })
export class DeliveryStatus {
  /** Notification email sent through Resend. */
  @Prop()
  emailSentAt?: Date;

  /** Notification sent to the owner's Telegram. */
  @Prop()
  telegramSentAt?: Date;

  @Prop()
  lastError?: string;
}
const DeliveryStatusSchema = SchemaFactory.createForClass(DeliveryStatus);

@Schema({ collection: 'contact_messages', timestamps: true })
export class ContactMessage {
  @Prop({ required: true, trim: true, minlength: 1, maxlength: 100 })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true, maxlength: 254 })
  email: string;

  @Prop({ required: true, trim: true, minlength: 1, maxlength: 150 })
  subject: string;

  @Prop({ required: true, trim: true, minlength: 10, maxlength: 5000 })
  message: string;

  @Prop({ type: String, enum: Object.values(Locale), default: Locale.EN })
  locale: Locale;

  @Prop({
    type: String,
    enum: Object.values(ContactMessageStatus),
    default: ContactMessageStatus.NEW,
  })
  status: ContactMessageStatus;

  @Prop({ index: true })
  visitorId?: string;

  @Prop()
  ipHash?: string;

  @Prop()
  userAgent?: string;

  @Prop({ type: DeliveryStatusSchema, default: () => ({}) })
  delivery: DeliveryStatus;
}

export type ContactMessageDocument = HydratedDocument<ContactMessage>;
export const ContactMessageSchema =
  SchemaFactory.createForClass(ContactMessage);
ContactMessageSchema.index({ status: 1, createdAt: -1 });

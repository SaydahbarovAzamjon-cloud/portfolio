import { Schema } from 'mongoose';
import { Locale } from '../libs/enums/common.enum';
import { ContactMessageStatus } from '../libs/enums/contact.enum';

const ContactMessageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 150,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 5000,
    },

    locale: {
      type: String,
      enum: Locale,
      default: Locale.EN,
    },

    status: {
      type: String,
      enum: ContactMessageStatus,
      default: ContactMessageStatus.NEW,
    },

    visitorId: {
      type: String,
      index: true,
    },

    ipHash: {
      type: String,
    },

    userAgent: {
      type: String,
    },

    delivery: {
      /** Notification email sent through Resend. */
      emailSentAt: {
        type: Date,
      },
      /** Notification sent to the owner's Telegram. */
      telegramSentAt: {
        type: Date,
      },
      lastError: {
        type: String,
      },
    },
  },
  { timestamps: true, collection: 'contact_messages' },
);

ContactMessageSchema.index({ status: 1, createdAt: -1 });

export default ContactMessageSchema;

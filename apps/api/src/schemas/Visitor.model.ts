import { Schema } from 'mongoose';
import { DeviceType } from '../libs/enums/analytics.enum';

/**
 * An anonymous visitor identified by a random id in a first-party cookie.
 * Raw IP addresses are never stored.
 */
const VisitorSchema = new Schema(
  {
    visitorId: {
      type: String,
      required: true,
      unique: true,
    },

    firstSeenAt: {
      type: Date,
      required: true,
      default: () => new Date(),
    },

    lastSeenAt: {
      type: Date,
      required: true,
      default: () => new Date(),
      index: true,
    },

    visitCount: {
      type: Number,
      default: 1,
      min: 1,
    },

    firstReferrer: {
      type: String,
    },

    locale: {
      type: String,
    },

    device: {
      browser: {
        type: String,
      },
      os: {
        type: String,
      },
      type: {
        type: String,
        enum: DeviceType,
        default: DeviceType.UNKNOWN,
      },
    },

    /** ISO country code, optional. */
    country: {
      type: String,
      uppercase: true,
      minlength: 2,
      maxlength: 2,
    },
  },
  { timestamps: true, collection: 'visitors' },
);

export default VisitorSchema;

import { Schema } from 'mongoose';
import { SocialPlatform } from '../libs/enums/profile.enum';
import {
  IconCardSchema,
  LocalizedTextSchema,
  MediaSchema,
  StatSchema,
} from './common';

const SocialLinkSchema = new Schema(
  {
    platform: {
      type: String,
      enum: SocialPlatform,
      required: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    handle: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const InterestSchema = new Schema(
  {
    icon: {
      type: String,
      required: true,
    },

    title: {
      type: LocalizedTextSchema,
      required: true,
    },

    description: {
      type: LocalizedTextSchema,
    },

    tags: {
      type: [LocalizedTextSchema],
      default: [],
    },
  },
  { _id: false },
);

const SpokenLanguageSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: LocalizedTextSchema,
      required: true,
    },
  },
  { _id: false },
);

const MomentSchema = new Schema(
  {
    image: {
      type: MediaSchema,
      required: true,
    },

    caption: {
      type: LocalizedTextSchema,
    },
  },
  { _id: false },
);

const QuoteSchema = new Schema(
  {
    /** Where the quote is shown, e.g. "philosophy", "journey", "education". */
    key: {
      type: String,
      required: true,
      trim: true,
    },

    text: {
      type: LocalizedTextSchema,
      required: true,
    },
  },
  { _id: false },
);

/** Singleton: the whole site has exactly one profile document. */
const ProfileSchema = new Schema(
  {
    singletonKey: {
      type: String,
      default: 'profile',
      unique: true,
      immutable: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    fullName: {
      type: LocalizedTextSchema,
      required: true,
    },

    headline: {
      type: LocalizedTextSchema,
      required: true,
    },

    tagline: {
      type: LocalizedTextSchema,
    },

    heroOrbitLabels: {
      type: [LocalizedTextSchema],
      default: [],
    },

    bioShort: {
      type: LocalizedTextSchema,
    },

    bioLong: {
      type: LocalizedTextSchema,
    },

    location: {
      city: {
        type: LocalizedTextSchema,
        required: true,
      },
      country: {
        type: LocalizedTextSchema,
        required: true,
      },
      /** IANA timezone, drives the header clock (e.g. Asia/Seoul). */
      timezone: {
        type: String,
        required: true,
        default: 'Asia/Seoul',
      },
    },

    availability: {
      isAvailable: {
        type: Boolean,
        default: true,
      },
      label: {
        type: LocalizedTextSchema,
      },
      details: {
        type: LocalizedTextSchema,
      },
    },

    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    socials: {
      type: [SocialLinkSchema],
      default: [],
    },

    resume: {
      en: {
        type: MediaSchema,
      },
      ko: {
        type: MediaSchema,
      },
    },

    /** Portfolio PDF, one per language. */
    portfolio: {
      en: {
        type: MediaSchema,
      },
      ko: {
        type: MediaSchema,
      },
    },

    images: {
      heroPortrait: {
        type: MediaSchema,
      },
      aboutPortrait: {
        type: MediaSchema,
      },
      contactPortrait: {
        type: MediaSchema,
      },
      signature: {
        type: MediaSchema,
      },
    },

    focusAreas: {
      type: [IconCardSchema],
      default: [],
    },

    philosophy: {
      type: [IconCardSchema],
      default: [],
    },

    interests: {
      type: [InterestSchema],
      default: [],
    },

    spokenLanguages: {
      type: [SpokenLanguageSchema],
      default: [],
    },

    moments: {
      type: [MomentSchema],
      default: [],
    },

    journey: {
      beginning: {
        date: {
          type: Date,
        },
        title: {
          type: LocalizedTextSchema,
        },
        text: {
          type: LocalizedTextSchema,
        },
      },
      future: {
        title: {
          type: LocalizedTextSchema,
        },
        points: {
          type: [LocalizedTextSchema],
          default: [],
        },
      },
    },

    contributions: {
      type: [IconCardSchema],
      default: [],
    },

    quotes: {
      type: [QuoteSchema],
      default: [],
    },

    manualStats: {
      type: [StatSchema],
      default: [],
    },
  },
  { timestamps: true, collection: 'profile' },
);

export default ProfileSchema;

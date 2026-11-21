import { Schema } from 'mongoose';
import { PageType } from '../libs/enums/analytics.enum';
import { Locale } from '../libs/enums/common.enum';

/** One page view. Analytics are aggregation queries over this collection. */
const PageViewSchema = new Schema(
  {
    visitorId: {
      type: String,
      required: true,
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
    },

    path: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    locale: {
      type: String,
      enum: Locale,
      default: Locale.EN,
    },

    pageType: {
      type: String,
      enum: PageType,
      required: true,
    },

    /** The project or article being viewed, when applicable. */
    entityId: {
      type: Schema.Types.ObjectId,
    },

    referrer: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'page_views',
  },
);

PageViewSchema.index({ createdAt: -1 });
PageViewSchema.index({ pageType: 1, createdAt: -1 });
PageViewSchema.index({ path: 1, createdAt: -1 });
PageViewSchema.index({ entityId: 1, createdAt: -1 }, { sparse: true });

export default PageViewSchema;

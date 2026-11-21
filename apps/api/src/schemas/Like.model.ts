import { Schema } from 'mongoose';

/** One like per anonymous visitor per article. */
const LikeSchema = new Schema(
  {
    articleId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Article',
    },

    visitorId: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false }, collection: 'likes' },
);

LikeSchema.index({ articleId: 1, visitorId: 1 }, { unique: true });

export default LikeSchema;

import { Schema } from 'mongoose';

/**
 * Remembers that a visitor saw an article, so a view is counted
 * only once per visitor per article every 24 hours. Rows delete themselves.
 */
const ArticleViewSchema = new Schema(
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

    createdAt: {
      type: Date,
      default: () => new Date(),
      expires: 60 * 60 * 24,
    },
  },
  { collection: 'article_views' },
);

ArticleViewSchema.index({ articleId: 1, visitorId: 1 }, { unique: true });

export default ArticleViewSchema;

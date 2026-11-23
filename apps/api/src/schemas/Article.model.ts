import { Schema } from 'mongoose';
import { ArticleCategory, ArticleStatus } from '../libs/enums/article.enum';
import { readingMinutes } from '../libs/config';
import { LocalizedTextSchema, MediaSchema } from './common';

const ArticleSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },

    title: {
      type: LocalizedTextSchema,
      required: true,
    },

    excerpt: {
      type: LocalizedTextSchema,
      required: true,
    },

    /** Markdown. `ko` is written by the admin (optional; the site falls back to `en`). */
    content: {
      type: LocalizedTextSchema,
      required: true,
    },

    category: {
      type: String,
      enum: ArticleCategory,
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    cover: {
      type: MediaSchema,
    },

    status: {
      type: String,
      enum: ArticleStatus,
      default: ArticleStatus.DRAFT,
    },

    publishedAt: {
      type: Date,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    /** Minutes, computed on save from `content`. */
    readingTime: {
      en: {
        type: Number,
        min: 1,
      },
      ko: {
        type: Number,
        min: 1,
      },
    },

    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    shareCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    /** Approved comments only. */
    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true, collection: 'articles' },
);

ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ status: 1, category: 1, publishedAt: -1 });
ArticleSchema.index(
  { 'title.en': 'text', 'excerpt.en': 'text', tags: 'text' },
  { name: 'article_search', weights: { 'title.en': 5, tags: 3 } },
);

ArticleSchema.pre('validate', function () {
  if (this.isModified('content') || !this.readingTime?.en) {
    this.readingTime = {
      en: readingMinutes(this.content?.en) ?? 1,
      ko: readingMinutes(this.content?.ko ?? undefined),
    };
  }
  if (this.status === ArticleStatus.PUBLISHED && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

export default ArticleSchema;

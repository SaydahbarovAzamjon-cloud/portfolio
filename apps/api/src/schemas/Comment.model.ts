import { Schema } from 'mongoose';
import { CommentStatus } from '../libs/enums/comment.enum';

/** New comments are PENDING and become public only after admin approval. */
const CommentSchema = new Schema(
  {
    articleId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Article',
    },

    /** One level of replies. */
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },

    authorName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 80,
    },

    /** Optional and private: never exposed by the public API. */
    authorEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
      select: false,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: CommentStatus,
      default: CommentStatus.PENDING,
    },

    /** Reply written by the site owner from the admin panel. */
    isOwnerReply: {
      type: Boolean,
      default: false,
    },

    visitorId: {
      type: String,
      index: true,
    },

    ipHash: {
      type: String,
      select: false,
    },

    userAgent: {
      type: String,
      select: false,
    },
  },
  { timestamps: true, collection: 'comments' },
);

CommentSchema.index({ articleId: 1, status: 1, createdAt: 1 });
CommentSchema.index({ status: 1, createdAt: -1 });

export default CommentSchema;

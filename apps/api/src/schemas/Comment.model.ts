import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Article } from './Article.model';
import { CommentStatus } from '../libs/enums/comment.enum';

/** New comments are PENDING and become public only after admin approval. */
@Schema({ collection: 'comments', timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: Article.name, required: true })
  article: Types.ObjectId;

  /** One level of replies. */
  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  parent: Types.ObjectId | null;

  @Prop({ required: true, trim: true, minlength: 1, maxlength: 80 })
  authorName: string;

  /** Optional and private: never exposed by the public API. */
  @Prop({ trim: true, lowercase: true, maxlength: 254, select: false })
  authorEmail?: string;

  @Prop({ required: true, trim: true, minlength: 1, maxlength: 2000 })
  content: string;

  @Prop({
    type: String,
    enum: Object.values(CommentStatus),
    default: CommentStatus.PENDING,
  })
  status: CommentStatus;

  /** Reply written by the site owner from the admin panel. */
  @Prop({ default: false })
  isOwnerReply: boolean;

  @Prop({ index: true })
  visitorId?: string;

  @Prop({ select: false })
  ipHash?: string;

  @Prop({ select: false })
  userAgent?: string;
}

export type CommentDocument = HydratedDocument<Comment>;
export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.index({ article: 1, status: 1, createdAt: 1 });
CommentSchema.index({ status: 1, createdAt: -1 });

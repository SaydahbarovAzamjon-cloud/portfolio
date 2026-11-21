import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Article } from './Article.model';

/** One like per anonymous visitor per article. */
@Schema({
  collection: 'likes',
  timestamps: { createdAt: true, updatedAt: false },
})
export class Like {
  @Prop({ type: Types.ObjectId, ref: Article.name, required: true })
  article: Types.ObjectId;

  @Prop({ required: true })
  visitorId: string;
}

export type LikeDocument = HydratedDocument<Like>;
export const LikeSchema = SchemaFactory.createForClass(Like);
LikeSchema.index({ article: 1, visitorId: 1 }, { unique: true });

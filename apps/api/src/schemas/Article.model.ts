import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  LocalizedText,
  LocalizedTextSchema,
  Media,
  MediaSchema,
} from './common';
import { User } from './User.model';
import {
  ArticleCategory,
  ArticleStatus,
  TranslationStatus,
} from '../libs/enums/article.enum';

const WORDS_PER_MINUTE = 200;

export function readingMinutes(text: string | undefined): number | undefined {
  if (!text) return undefined;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

@Schema({ _id: false })
export class ReadingTime {
  @Prop({ required: true, min: 1 })
  en: number;

  @Prop({ min: 1 })
  ko?: number;
}
const ReadingTimeSchema = SchemaFactory.createForClass(ReadingTime);

@Schema({ _id: false })
export class TranslationInfo {
  @Prop({
    type: String,
    enum: Object.values(TranslationStatus),
    default: TranslationStatus.NONE,
  })
  status: TranslationStatus;

  @Prop()
  translatedAt?: Date;

  /** AI model used for the translation, when status = AI. */
  @Prop()
  model?: string;
}
const TranslationInfoSchema = SchemaFactory.createForClass(TranslationInfo);

@Schema({ _id: false })
export class ArticleTranslations {
  @Prop({ type: TranslationInfoSchema, default: () => ({}) })
  ko: TranslationInfo;
}
const ArticleTranslationsSchema =
  SchemaFactory.createForClass(ArticleTranslations);

@Schema({ collection: 'articles', timestamps: true })
export class Article {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  })
  slug: string;

  @Prop({ type: LocalizedTextSchema, required: true })
  title: LocalizedText;

  @Prop({ type: LocalizedTextSchema, required: true })
  excerpt: LocalizedText;

  /** Markdown. English is written now; Korean is filled later by AI translation. */
  @Prop({ type: LocalizedTextSchema, required: true })
  content: LocalizedText;

  @Prop({ type: String, enum: Object.values(ArticleCategory), required: true })
  category: ArticleCategory;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: MediaSchema })
  cover?: Media;

  @Prop({
    type: String,
    enum: Object.values(ArticleStatus),
    default: ArticleStatus.DRAFT,
  })
  status: ArticleStatus;

  @Prop()
  publishedAt?: Date;

  @Prop({ default: false })
  featured: boolean;

  /** Computed on save from `content`. */
  @Prop({ type: ReadingTimeSchema })
  readingTime: ReadingTime;

  @Prop({ type: ArticleTranslationsSchema, default: () => ({}) })
  translation: ArticleTranslations;

  @Prop({ default: 0, min: 0 })
  viewCount: number;

  @Prop({ default: 0, min: 0 })
  likeCount: number;

  /** Approved comments only. */
  @Prop({ default: 0, min: 0 })
  commentCount: number;

  @Prop({ type: Types.ObjectId, ref: User.name })
  author?: Types.ObjectId;
}

export type ArticleDocument = HydratedDocument<Article>;
export const ArticleSchema = SchemaFactory.createForClass(Article);

ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ status: 1, category: 1, publishedAt: -1 });
ArticleSchema.index(
  { 'title.en': 'text', 'excerpt.en': 'text', tags: 'text' },
  { name: 'article_search', weights: { 'title.en': 5, tags: 3 } },
);

ArticleSchema.pre('validate', function () {
  if (this.isModified('content') || !this.readingTime) {
    this.readingTime = {
      en: readingMinutes(this.content?.en) ?? 1,
      ko: readingMinutes(this.content?.ko),
    };
  }
  if (this.status === ArticleStatus.PUBLISHED && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PageType } from '../libs/enums/analytics.enum';
import { Locale } from '../libs/enums/common.enum';

/** One page view. Analytics are aggregation queries over this collection. */
@Schema({
  collection: 'page_views',
  timestamps: { createdAt: true, updatedAt: false },
})
export class PageView {
  @Prop({ required: true, index: true })
  visitorId: string;

  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true, trim: true, maxlength: 500 })
  path: string;

  @Prop({ type: String, enum: Object.values(Locale), default: Locale.EN })
  locale: Locale;

  @Prop({ type: String, enum: Object.values(PageType), required: true })
  pageType: PageType;

  /** The project or article being viewed, when applicable. */
  @Prop({ type: Types.ObjectId })
  entity?: Types.ObjectId;

  @Prop({ maxlength: 500 })
  referrer?: string;
}

export type PageViewDocument = HydratedDocument<PageView>;
export const PageViewSchema = SchemaFactory.createForClass(PageView);
PageViewSchema.index({ createdAt: -1 });
PageViewSchema.index({ pageType: 1, createdAt: -1 });
PageViewSchema.index({ path: 1, createdAt: -1 });
PageViewSchema.index({ entity: 1, createdAt: -1 }, { sparse: true });

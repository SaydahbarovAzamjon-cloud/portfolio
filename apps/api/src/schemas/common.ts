import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Shared embedded types (sub-documents without their own _id).
 * See docs/DATA_MODEL.md §0.
 */

/** Human-readable text. `en` is required; `ko` falls back to `en` on the frontend. */
@Schema({ _id: false })
export class LocalizedText {
  @Prop({ required: true, trim: true })
  en: string;

  @Prop({ trim: true })
  ko?: string;
}
export const LocalizedTextSchema = SchemaFactory.createForClass(LocalizedText);

/** An image or file stored on the VPS disk (see `uploads`). */
@Schema({ _id: false })
export class Media {
  @Prop({ required: true, trim: true })
  url: string;

  @Prop({ type: LocalizedTextSchema })
  alt?: LocalizedText;

  @Prop({ min: 0 })
  width?: number;

  @Prop({ min: 0 })
  height?: number;

  /** Tiny base64 placeholder for blur-up loading. */
  @Prop()
  blurDataUrl?: string;
}
export const MediaSchema = SchemaFactory.createForClass(Media);

/** Icon + title + description tile (feature cards, philosophy, contributions). */
@Schema({ _id: false })
export class IconCard {
  @Prop({ required: true, trim: true })
  icon: string;

  @Prop({ type: LocalizedTextSchema, required: true })
  title: LocalizedText;

  @Prop({ type: LocalizedTextSchema })
  description?: LocalizedText;
}
export const IconCardSchema = SchemaFactory.createForClass(IconCard);

/** A number that cannot be computed from data (e.g. "20+ technologies"). */
@Schema({ _id: false })
export class Stat {
  @Prop({ required: true, trim: true })
  value: string;

  @Prop({ type: LocalizedTextSchema, required: true })
  label: LocalizedText;
}
export const StatSchema = SchemaFactory.createForClass(Stat);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LocalizedText, LocalizedTextSchema } from './common';

@Schema({ collection: 'skill_categories', timestamps: true })
export class SkillCategory {
  /** Stable key: frontend, backend, ai-ml, infrastructure. */
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  key: string;

  @Prop({ type: LocalizedTextSchema, required: true })
  title: LocalizedText;

  @Prop({ type: LocalizedTextSchema })
  description?: LocalizedText;

  @Prop({ required: true })
  icon: string;

  @Prop({ default: 0, index: true })
  order: number;
}

export type SkillCategoryDocument = HydratedDocument<SkillCategory>;
export const SkillCategorySchema = SchemaFactory.createForClass(SkillCategory);

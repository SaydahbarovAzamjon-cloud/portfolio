import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SkillCategory } from './SkillCategory.model';

/** One technology. Projects and experiences reference skills, so names and icons stay consistent. */
@Schema({ collection: 'skills', timestamps: true })
export class Skill {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  /** Simple Icons slug or custom icon key. */
  @Prop({ required: true, trim: true })
  icon: string;

  @Prop({
    type: Types.ObjectId,
    ref: SkillCategory.name,
    required: true,
    index: true,
  })
  category: Types.ObjectId;

  /** Shown in the Home "Tools I Work With" preview. */
  @Prop({ default: false })
  featured: boolean;

  @Prop({ default: 0 })
  order: number;
}

export type SkillDocument = HydratedDocument<Skill>;
export const SkillSchema = SchemaFactory.createForClass(Skill);
SkillSchema.index({ category: 1, order: 1 });

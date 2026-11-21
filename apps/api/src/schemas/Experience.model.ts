import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  LocalizedText,
  LocalizedTextSchema,
  Media,
  MediaSchema,
} from './common';
import { EmploymentType } from '../libs/enums/experience.enum';

@Schema({ collection: 'experiences', timestamps: true })
export class Experience {
  @Prop({ required: true, trim: true })
  company: string;

  @Prop({ type: MediaSchema })
  companyLogo?: Media;

  @Prop({ type: MediaSchema })
  companyImage?: Media;

  @Prop({ type: LocalizedTextSchema, required: true })
  role: LocalizedText;

  @Prop({
    type: String,
    enum: Object.values(EmploymentType),
    default: EmploymentType.FULL_TIME,
  })
  employmentType: EmploymentType;

  @Prop({ type: LocalizedTextSchema })
  location?: LocalizedText;

  @Prop({ required: true })
  startDate: Date;

  /** null = current position. Duration is computed, not stored. */
  @Prop({ type: Date, default: null })
  endDate: Date | null;

  @Prop({ type: LocalizedTextSchema })
  summary?: LocalizedText;

  @Prop({ type: [LocalizedTextSchema], default: [] })
  responsibilities: LocalizedText[];

  @Prop({ type: [LocalizedTextSchema], default: [] })
  achievements: LocalizedText[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Skill' }], default: [] })
  skills: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Project' }], default: [] })
  projects: Types.ObjectId[];

  @Prop({ default: 0, index: true })
  order: number;
}

export type ExperienceDocument = HydratedDocument<Experience>;
export const ExperienceSchema = SchemaFactory.createForClass(Experience);
ExperienceSchema.index({ startDate: -1 });

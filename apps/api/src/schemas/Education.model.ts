import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  LocalizedText,
  LocalizedTextSchema,
  Media,
  MediaSchema,
} from './common';
import { DegreeType, EducationStatus } from '../libs/enums/education.enum';

@Schema({ collection: 'education', timestamps: true })
export class Education {
  @Prop({ type: String, enum: Object.values(DegreeType), required: true })
  degree: DegreeType;

  @Prop({ type: LocalizedTextSchema, required: true })
  institution: LocalizedText;

  /** Name in the institution's own language, e.g. "Toshkent davlat transport universiteti". */
  @Prop({ trim: true })
  institutionNative?: string;

  @Prop({ type: LocalizedTextSchema })
  program?: LocalizedText;

  @Prop({ type: LocalizedTextSchema })
  major?: LocalizedText;

  @Prop({ type: LocalizedTextSchema })
  qualification?: LocalizedText;

  @Prop({ type: LocalizedTextSchema })
  location?: LocalizedText;

  @Prop({ required: true })
  startDate: Date;

  /** Graduation date, or expected graduation while IN_PROGRESS. */
  @Prop()
  endDate?: Date;

  @Prop({
    type: String,
    enum: Object.values(EducationStatus),
    required: true,
  })
  status: EducationStatus;

  @Prop({ type: MediaSchema })
  image?: Media;

  @Prop({ default: 0, index: true })
  order: number;
}

export type EducationDocument = HydratedDocument<Education>;
export const EducationSchema = SchemaFactory.createForClass(Education);

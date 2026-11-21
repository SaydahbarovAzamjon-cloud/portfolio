import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  LocalizedText,
  LocalizedTextSchema,
  Media,
  MediaSchema,
} from './common';
import { ProjectCategory, ProjectStatus } from '../libs/enums/project.enum';

@Schema({ _id: false })
export class ProjectLinks {
  @Prop({ trim: true })
  live?: string;

  @Prop({ trim: true })
  github?: string;

  @Prop({ trim: true })
  demo?: string;
}
const ProjectLinksSchema = SchemaFactory.createForClass(ProjectLinks);

@Schema({ _id: false })
export class ProjectMedia {
  @Prop({ type: MediaSchema })
  cover?: Media;

  @Prop({ type: MediaSchema })
  thumbnail?: Media;

  /** Device mockups (laptop / phone) used in galleries. */
  @Prop({ type: [MediaSchema], default: [] })
  mockups: Media[];

  @Prop({ type: [MediaSchema], default: [] })
  gallery: Media[];
}
const ProjectMediaSchema = SchemaFactory.createForClass(ProjectMedia);

@Schema({ _id: false })
export class ProjectTheme {
  /** Accent colour for the card, e.g. "#8b5cf6" for Lumora. */
  @Prop({ match: /^#[0-9a-fA-F]{6}$/ })
  accent?: string;

  /** Card uses a dark background (e.g. CarVia). */
  @Prop({ default: false })
  dark: boolean;
}
const ProjectThemeSchema = SchemaFactory.createForClass(ProjectTheme);

@Schema({ _id: false })
export class ProjectHighlight {
  @Prop({ required: true })
  icon: string;

  @Prop({ type: LocalizedTextSchema, required: true })
  label: LocalizedText;
}
const ProjectHighlightSchema = SchemaFactory.createForClass(ProjectHighlight);

/** Case study page content. Text fields accept markdown. */
@Schema({ _id: false })
export class CaseStudy {
  @Prop({ type: LocalizedTextSchema })
  overview?: LocalizedText;

  @Prop({ type: LocalizedTextSchema })
  problem?: LocalizedText;

  @Prop({ type: LocalizedTextSchema })
  solution?: LocalizedText;

  @Prop({ type: LocalizedTextSchema })
  architecture?: LocalizedText;

  @Prop({ type: [LocalizedTextSchema], default: [] })
  features: LocalizedText[];

  @Prop({ type: [LocalizedTextSchema], default: [] })
  challenges: LocalizedText[];

  @Prop({ type: [LocalizedTextSchema], default: [] })
  results: LocalizedText[];

  @Prop({ type: LocalizedTextSchema })
  role?: LocalizedText;

  @Prop({ min: 1 })
  teamSize?: number;

  @Prop({ type: LocalizedTextSchema })
  duration?: LocalizedText;
}
const CaseStudySchema = SchemaFactory.createForClass(CaseStudy);

@Schema({ _id: false })
export class ProjectPeriod {
  @Prop()
  start?: Date;

  @Prop()
  end?: Date;
}
const ProjectPeriodSchema = SchemaFactory.createForClass(ProjectPeriod);

@Schema({ collection: 'projects', timestamps: true })
export class Project {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  })
  slug: string;

  /** Brand name, not translated (Fixora, CarVia, ...). */
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ type: LocalizedTextSchema, required: true })
  subtitle: LocalizedText;

  @Prop({ type: LocalizedTextSchema, required: true })
  summary: LocalizedText;

  @Prop({ type: String, enum: Object.values(ProjectCategory), required: true })
  category: ProjectCategory;

  @Prop({
    type: String,
    enum: Object.values(ProjectStatus),
    default: ProjectStatus.COMPLETED,
  })
  status: ProjectStatus;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: false })
  showOnHome: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Skill' }], default: [] })
  skills: Types.ObjectId[];

  @Prop({ type: ProjectLinksSchema, default: () => ({}) })
  links: ProjectLinks;

  @Prop({ type: ProjectMediaSchema, default: () => ({}) })
  media: ProjectMedia;

  @Prop({ type: ProjectThemeSchema, default: () => ({}) })
  theme: ProjectTheme;

  @Prop({ type: [ProjectHighlightSchema], default: [] })
  highlights: ProjectHighlight[];

  @Prop({ type: CaseStudySchema, default: () => ({}) })
  caseStudy: CaseStudy;

  @Prop({ type: ProjectPeriodSchema, default: () => ({}) })
  period: ProjectPeriod;

  @Prop({ default: false })
  isPublished: boolean;
}

export type ProjectDocument = HydratedDocument<Project>;
export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.index({ isPublished: 1, order: 1 });
ProjectSchema.index({ isPublished: 1, showOnHome: 1, order: 1 });

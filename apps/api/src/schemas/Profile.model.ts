import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  IconCard,
  IconCardSchema,
  LocalizedText,
  LocalizedTextSchema,
  Media,
  MediaSchema,
  Stat,
  StatSchema,
} from './common';
import { SocialPlatform } from '../libs/enums/profile.enum';

@Schema({ _id: false })
export class Location {
  @Prop({ type: LocalizedTextSchema, required: true })
  city: LocalizedText;

  @Prop({ type: LocalizedTextSchema, required: true })
  country: LocalizedText;

  /** IANA timezone, drives the header clock (e.g. Asia/Seoul). */
  @Prop({ required: true, default: 'Asia/Seoul' })
  timezone: string;
}
const LocationSchema = SchemaFactory.createForClass(Location);

@Schema({ _id: false })
export class Availability {
  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ type: LocalizedTextSchema })
  label?: LocalizedText;

  @Prop({ type: LocalizedTextSchema })
  details?: LocalizedText;
}
const AvailabilitySchema = SchemaFactory.createForClass(Availability);

@Schema({ _id: false })
export class SocialLink {
  @Prop({ type: String, enum: Object.values(SocialPlatform), required: true })
  platform: SocialPlatform;

  @Prop({ required: true, trim: true })
  url: string;

  @Prop({ trim: true })
  handle?: string;
}
const SocialLinkSchema = SchemaFactory.createForClass(SocialLink);

@Schema({ _id: false })
export class Resume {
  @Prop({ type: MediaSchema })
  en?: Media;

  @Prop({ type: MediaSchema })
  ko?: Media;
}
const ResumeSchema = SchemaFactory.createForClass(Resume);

@Schema({ _id: false })
export class ProfileImages {
  @Prop({ type: MediaSchema })
  heroPortrait?: Media;

  @Prop({ type: MediaSchema })
  aboutPortrait?: Media;

  @Prop({ type: MediaSchema })
  contactPortrait?: Media;

  @Prop({ type: MediaSchema })
  signature?: Media;
}
const ProfileImagesSchema = SchemaFactory.createForClass(ProfileImages);

@Schema({ _id: false })
export class Interest {
  @Prop({ required: true })
  icon: string;

  @Prop({ type: LocalizedTextSchema, required: true })
  title: LocalizedText;

  @Prop({ type: LocalizedTextSchema })
  description?: LocalizedText;

  @Prop({ type: [LocalizedTextSchema], default: [] })
  tags: LocalizedText[];
}
const InterestSchema = SchemaFactory.createForClass(Interest);

@Schema({ _id: false })
export class SpokenLanguage {
  @Prop({ required: true, lowercase: true, trim: true })
  code: string;

  @Prop({ type: LocalizedTextSchema, required: true })
  name: LocalizedText;
}
const SpokenLanguageSchema = SchemaFactory.createForClass(SpokenLanguage);

@Schema({ _id: false })
export class Moment {
  @Prop({ type: MediaSchema, required: true })
  image: Media;

  @Prop({ type: LocalizedTextSchema })
  caption?: LocalizedText;
}
const MomentSchema = SchemaFactory.createForClass(Moment);

@Schema({ _id: false })
export class JourneyBeginning {
  @Prop()
  date?: Date;

  @Prop({ type: LocalizedTextSchema })
  title?: LocalizedText;

  @Prop({ type: LocalizedTextSchema })
  text?: LocalizedText;
}
const JourneyBeginningSchema = SchemaFactory.createForClass(JourneyBeginning);

@Schema({ _id: false })
export class JourneyFuture {
  @Prop({ type: LocalizedTextSchema })
  title?: LocalizedText;

  @Prop({ type: [LocalizedTextSchema], default: [] })
  points: LocalizedText[];
}
const JourneyFutureSchema = SchemaFactory.createForClass(JourneyFuture);

@Schema({ _id: false })
export class Journey {
  @Prop({ type: JourneyBeginningSchema })
  beginning?: JourneyBeginning;

  @Prop({ type: JourneyFutureSchema })
  future?: JourneyFuture;
}
const JourneySchema = SchemaFactory.createForClass(Journey);

@Schema({ _id: false })
export class Quote {
  /** Where the quote is shown, e.g. "philosophy", "journey", "education". */
  @Prop({ required: true, trim: true })
  key: string;

  @Prop({ type: LocalizedTextSchema, required: true })
  text: LocalizedText;
}
const QuoteSchema = SchemaFactory.createForClass(Quote);

/** Singleton: the whole site has exactly one profile document. */
@Schema({ collection: 'profile', timestamps: true })
export class Profile {
  @Prop({ default: 'profile', unique: true, immutable: true })
  singletonKey: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: LocalizedTextSchema, required: true })
  fullName: LocalizedText;

  @Prop({ type: LocalizedTextSchema, required: true })
  headline: LocalizedText;

  @Prop({ type: LocalizedTextSchema })
  tagline?: LocalizedText;

  @Prop({ type: [LocalizedTextSchema], default: [] })
  heroOrbitLabels: LocalizedText[];

  @Prop({ type: LocalizedTextSchema })
  bioShort?: LocalizedText;

  @Prop({ type: LocalizedTextSchema })
  bioLong?: LocalizedText;

  @Prop({ type: LocationSchema, required: true })
  location: Location;

  @Prop({ type: AvailabilitySchema, default: () => ({}) })
  availability: Availability;

  @Prop({ required: true, lowercase: true, trim: true })
  contactEmail: string;

  @Prop({ type: [SocialLinkSchema], default: [] })
  socials: SocialLink[];

  @Prop({ type: ResumeSchema, default: () => ({}) })
  resume: Resume;

  @Prop({ type: ProfileImagesSchema, default: () => ({}) })
  images: ProfileImages;

  @Prop({ type: [IconCardSchema], default: [] })
  focusAreas: IconCard[];

  @Prop({ type: [IconCardSchema], default: [] })
  philosophy: IconCard[];

  @Prop({ type: [InterestSchema], default: [] })
  interests: Interest[];

  @Prop({ type: [SpokenLanguageSchema], default: [] })
  spokenLanguages: SpokenLanguage[];

  @Prop({ type: [MomentSchema], default: [] })
  moments: Moment[];

  @Prop({ type: JourneySchema, default: () => ({}) })
  journey: Journey;

  @Prop({ type: [IconCardSchema], default: [] })
  contributions: IconCard[];

  @Prop({ type: [QuoteSchema], default: [] })
  quotes: Quote[];

  @Prop({ type: [StatSchema], default: [] })
  manualStats: Stat[];
}

export type ProfileDocument = HydratedDocument<Profile>;
export const ProfileSchema = SchemaFactory.createForClass(Profile);

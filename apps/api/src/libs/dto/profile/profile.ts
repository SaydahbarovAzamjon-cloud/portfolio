import { Field, ObjectType } from '@nestjs/graphql';
import type { Types } from 'mongoose';
import { SocialPlatform } from '../../enums/profile.enum';
import { IconCard, LocalizedText, Media, Stat } from '../common/common';

@ObjectType()
export class Location {
  @Field(() => LocalizedText)
  city: LocalizedText;

  @Field(() => LocalizedText)
  country: LocalizedText;

  @Field(() => String)
  timezone: string;
}

@ObjectType()
export class Availability {
  @Field(() => Boolean)
  isAvailable: boolean;

  @Field(() => LocalizedText, { nullable: true })
  label?: LocalizedText;

  @Field(() => LocalizedText, { nullable: true })
  details?: LocalizedText;
}

@ObjectType()
export class SocialLink {
  @Field(() => SocialPlatform)
  platform: SocialPlatform;

  @Field(() => String)
  url: string;

  @Field(() => String, { nullable: true })
  handle?: string;
}

@ObjectType()
export class Resume {
  @Field(() => Media, { nullable: true })
  en?: Media;

  @Field(() => Media, { nullable: true })
  ko?: Media;
}

@ObjectType()
export class ProfileImages {
  @Field(() => Media, { nullable: true })
  heroPortrait?: Media;

  @Field(() => Media, { nullable: true })
  aboutPortrait?: Media;

  @Field(() => Media, { nullable: true })
  contactPortrait?: Media;

  @Field(() => Media, { nullable: true })
  signature?: Media;
}

@ObjectType()
export class Interest {
  @Field(() => String)
  icon: string;

  @Field(() => LocalizedText)
  title: LocalizedText;

  @Field(() => LocalizedText, { nullable: true })
  description?: LocalizedText;

  @Field(() => [LocalizedText])
  tags: LocalizedText[];
}

@ObjectType()
export class SpokenLanguage {
  @Field(() => String)
  code: string;

  @Field(() => LocalizedText)
  name: LocalizedText;
}

@ObjectType()
export class Moment {
  @Field(() => Media)
  image: Media;

  @Field(() => LocalizedText, { nullable: true })
  caption?: LocalizedText;
}

@ObjectType()
export class JourneyBeginning {
  @Field(() => Date, { nullable: true })
  date?: Date;

  @Field(() => LocalizedText, { nullable: true })
  title?: LocalizedText;

  @Field(() => LocalizedText, { nullable: true })
  text?: LocalizedText;
}

@ObjectType()
export class JourneyFuture {
  @Field(() => LocalizedText, { nullable: true })
  title?: LocalizedText;

  @Field(() => [LocalizedText])
  points: LocalizedText[];
}

@ObjectType()
export class Journey {
  @Field(() => JourneyBeginning, { nullable: true })
  beginning?: JourneyBeginning;

  @Field(() => JourneyFuture, { nullable: true })
  future?: JourneyFuture;
}

@ObjectType()
export class Quote {
  @Field(() => String)
  key: string;

  @Field(() => LocalizedText)
  text: LocalizedText;
}

@ObjectType()
export class Profile {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field(() => String)
  name: string;

  @Field(() => LocalizedText)
  fullName: LocalizedText;

  @Field(() => LocalizedText)
  headline: LocalizedText;

  @Field(() => LocalizedText, { nullable: true })
  tagline?: LocalizedText;

  @Field(() => [LocalizedText])
  heroOrbitLabels: LocalizedText[];

  @Field(() => LocalizedText, { nullable: true })
  bioShort?: LocalizedText;

  @Field(() => LocalizedText, { nullable: true })
  bioLong?: LocalizedText;

  @Field(() => Location)
  location: Location;

  @Field(() => Availability)
  availability: Availability;

  @Field(() => String)
  contactEmail: string;

  @Field(() => [SocialLink])
  socials: SocialLink[];

  @Field(() => Resume, { nullable: true })
  resume?: Resume;

  /** Portfolio PDF in both languages (same shape as the resume). */
  @Field(() => Resume, { nullable: true })
  portfolio?: Resume;

  @Field(() => ProfileImages, { nullable: true })
  images?: ProfileImages;

  @Field(() => [IconCard])
  focusAreas: IconCard[];

  @Field(() => [IconCard])
  philosophy: IconCard[];

  @Field(() => [Interest])
  interests: Interest[];

  @Field(() => [SpokenLanguage])
  spokenLanguages: SpokenLanguage[];

  @Field(() => [Moment])
  moments: Moment[];

  @Field(() => Journey, { nullable: true })
  journey?: Journey;

  @Field(() => [IconCard])
  contributions: IconCard[];

  @Field(() => [Quote])
  quotes: Quote[];

  @Field(() => [Stat])
  manualStats: Stat[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

/** Mutation result: success message + the saved profile. */
@ObjectType()
export class ProfileResult {
  @Field(() => String)
  message: string;

  @Field(() => Profile)
  data: Profile;
}

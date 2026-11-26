import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsTimeZone,
  IsUrl,
  Length,
  ValidateNested,
} from 'class-validator';
import { SocialPlatform } from '../../enums/profile.enum';
import {
  IconCardInput,
  LocalizedTextInput,
  MediaInput,
  StatInput,
} from '../common/common.input';

@InputType()
export class LocationInput {
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput)
  city: LocalizedTextInput;

  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput)
  country: LocalizedTextInput;

  @IsOptional()
  @IsTimeZone()
  @Field(() => String, { nullable: true })
  timezone?: string;
}

@InputType()
export class AvailabilityInput {
  @IsBoolean()
  @Field(() => Boolean)
  isAvailable: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  label?: LocalizedTextInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  details?: LocalizedTextInput;
}

@InputType()
export class SocialLinkInput {
  @IsEnum(SocialPlatform)
  @Field(() => SocialPlatform)
  platform: SocialPlatform;

  @IsUrl()
  @Field(() => String)
  url: string;

  @IsOptional()
  @Length(1, 100)
  @Field(() => String, { nullable: true })
  handle?: string;
}

@InputType()
export class ResumeInput {
  @IsOptional()
  @ValidateNested()
  @Type(() => MediaInput)
  @Field(() => MediaInput, { nullable: true })
  en?: MediaInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaInput)
  @Field(() => MediaInput, { nullable: true })
  ko?: MediaInput;
}

@InputType()
export class ProfileImagesInput {
  @IsOptional()
  @ValidateNested()
  @Type(() => MediaInput)
  @Field(() => MediaInput, { nullable: true })
  heroPortrait?: MediaInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaInput)
  @Field(() => MediaInput, { nullable: true })
  aboutPortrait?: MediaInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaInput)
  @Field(() => MediaInput, { nullable: true })
  contactPortrait?: MediaInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaInput)
  @Field(() => MediaInput, { nullable: true })
  signature?: MediaInput;
}

@InputType()
export class InterestInput {
  @IsNotEmpty()
  @Length(1, 100)
  @Field(() => String)
  icon: string;

  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput)
  title: LocalizedTextInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  description?: LocalizedTextInput;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LocalizedTextInput)
  @Field(() => [LocalizedTextInput], { nullable: true })
  tags?: LocalizedTextInput[];
}

@InputType()
export class SpokenLanguageInput {
  @IsNotEmpty()
  @Length(2, 5)
  @Field(() => String)
  code: string;

  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput)
  name: LocalizedTextInput;
}

@InputType()
export class MomentInput {
  @ValidateNested()
  @Type(() => MediaInput)
  @Field(() => MediaInput)
  image: MediaInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  caption?: LocalizedTextInput;
}

@InputType()
export class JourneyBeginningInput {
  @IsOptional()
  @Field(() => Date, { nullable: true })
  date?: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  title?: LocalizedTextInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  text?: LocalizedTextInput;
}

@InputType()
export class JourneyFutureInput {
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  title?: LocalizedTextInput;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LocalizedTextInput)
  @Field(() => [LocalizedTextInput], { nullable: true })
  points?: LocalizedTextInput[];
}

@InputType()
export class JourneyInput {
  @IsOptional()
  @ValidateNested()
  @Type(() => JourneyBeginningInput)
  @Field(() => JourneyBeginningInput, { nullable: true })
  beginning?: JourneyBeginningInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => JourneyFutureInput)
  @Field(() => JourneyFutureInput, { nullable: true })
  future?: JourneyFutureInput;
}

@InputType()
export class QuoteInput {
  @IsNotEmpty()
  @Length(1, 50)
  @Field(() => String)
  key: string;

  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput)
  text: LocalizedTextInput;
}

/**
 * Admin edits the profile. Every field is optional: only the fields you send are changed.
 * Arrays (socials, philosophy, ...) are replaced as a whole.
 */
@InputType()
export class ProfileUpdate {
  @IsOptional()
  @Length(1, 50)
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  fullName?: LocalizedTextInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  headline?: LocalizedTextInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  tagline?: LocalizedTextInput;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LocalizedTextInput)
  @Field(() => [LocalizedTextInput], { nullable: true })
  heroOrbitLabels?: LocalizedTextInput[];

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  bioShort?: LocalizedTextInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  bioLong?: LocalizedTextInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationInput)
  @Field(() => LocationInput, { nullable: true })
  location?: LocationInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => AvailabilityInput)
  @Field(() => AvailabilityInput, { nullable: true })
  availability?: AvailabilityInput;

  @IsOptional()
  @IsEmail()
  @Field(() => String, { nullable: true })
  contactEmail?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkInput)
  @Field(() => [SocialLinkInput], { nullable: true })
  socials?: SocialLinkInput[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ResumeInput)
  @Field(() => ResumeInput, { nullable: true })
  resume?: ResumeInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => ResumeInput)
  @Field(() => ResumeInput, { nullable: true })
  portfolio?: ResumeInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProfileImagesInput)
  @Field(() => ProfileImagesInput, { nullable: true })
  images?: ProfileImagesInput;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => IconCardInput)
  @Field(() => [IconCardInput], { nullable: true })
  focusAreas?: IconCardInput[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => IconCardInput)
  @Field(() => [IconCardInput], { nullable: true })
  philosophy?: IconCardInput[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => InterestInput)
  @Field(() => [InterestInput], { nullable: true })
  interests?: InterestInput[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SpokenLanguageInput)
  @Field(() => [SpokenLanguageInput], { nullable: true })
  spokenLanguages?: SpokenLanguageInput[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MomentInput)
  @Field(() => [MomentInput], { nullable: true })
  moments?: MomentInput[];

  @IsOptional()
  @ValidateNested()
  @Type(() => JourneyInput)
  @Field(() => JourneyInput, { nullable: true })
  journey?: JourneyInput;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => IconCardInput)
  @Field(() => [IconCardInput], { nullable: true })
  contributions?: IconCardInput[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => QuoteInput)
  @Field(() => [QuoteInput], { nullable: true })
  quotes?: QuoteInput[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => StatInput)
  @Field(() => [StatInput], { nullable: true })
  manualStats?: StatInput[];
}

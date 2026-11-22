import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProjectCategory, ProjectStatus } from '../../enums/project.enum';
import { LocalizedTextInput, MediaInput } from '../common/common.input';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

@InputType()
export class ProjectHighlightInput {
  @IsNotEmpty()
  @Length(1, 60)
  @Field(() => String)
  icon: string;

  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput)
  label: LocalizedTextInput;
}

@InputType()
export class ProjectLinksInput {
  @IsOptional()
  @IsUrl()
  @Field(() => String, { nullable: true })
  live?: string;

  @IsOptional()
  @IsUrl()
  @Field(() => String, { nullable: true })
  github?: string;

  @IsOptional()
  @IsUrl()
  @Field(() => String, { nullable: true })
  demo?: string;
}

@InputType()
export class ProjectMediaInput {
  @IsOptional()
  @ValidateNested()
  @Type(() => MediaInput)
  @Field(() => MediaInput, { nullable: true })
  cover?: MediaInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaInput)
  @Field(() => MediaInput, { nullable: true })
  thumbnail?: MediaInput;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaInput)
  @Field(() => [MediaInput], { nullable: true })
  mockups?: MediaInput[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaInput)
  @Field(() => [MediaInput], { nullable: true })
  gallery?: MediaInput[];
}

@InputType()
export class ProjectThemeInput {
  /** e.g. "#8b5cf6" **/
  @IsOptional()
  @Matches(/^#[0-9a-fA-F]{6}$/)
  @Field(() => String, { nullable: true })
  accent?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  dark?: boolean;
}

@InputType()
export class CaseStudyInput {
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  overview?: LocalizedTextInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  problem?: LocalizedTextInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  solution?: LocalizedTextInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  architecture?: LocalizedTextInput;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocalizedTextInput)
  @Field(() => [LocalizedTextInput], { nullable: true })
  features?: LocalizedTextInput[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocalizedTextInput)
  @Field(() => [LocalizedTextInput], { nullable: true })
  challenges?: LocalizedTextInput[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocalizedTextInput)
  @Field(() => [LocalizedTextInput], { nullable: true })
  results?: LocalizedTextInput[];

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  role?: LocalizedTextInput;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Field(() => Int, { nullable: true })
  teamSize?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  duration?: LocalizedTextInput;
}

@InputType()
export class ProjectPeriodInput {
  @IsOptional()
  @Field(() => Date, { nullable: true })
  start?: Date;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  end?: Date;
}

@InputType()
export class ProjectInput {
  /** Brand name, e.g. "Fixora" **/
  @IsNotEmpty()
  @Length(1, 80)
  @Field(() => String)
  title: string;

  /** optional: made from the title when empty ("Fixora" → "fixora") **/
  @IsOptional()
  @Matches(SLUG_PATTERN)
  @Field(() => String, { nullable: true })
  slug?: string;

  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput)
  subtitle: LocalizedTextInput;

  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput)
  summary: LocalizedTextInput;

  @IsEnum(ProjectCategory)
  @Field(() => ProjectCategory)
  category: ProjectCategory;

  @IsOptional()
  @IsEnum(ProjectStatus)
  @Field(() => ProjectStatus, { nullable: true })
  status?: ProjectStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: true })
  order?: number;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  showOnHome?: boolean;

  @IsOptional()
  @IsMongoId({ each: true })
  @Field(() => [String], { nullable: true })
  skillIds?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectLinksInput)
  @Field(() => ProjectLinksInput, { nullable: true })
  links?: ProjectLinksInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectMediaInput)
  @Field(() => ProjectMediaInput, { nullable: true })
  media?: ProjectMediaInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectThemeInput)
  @Field(() => ProjectThemeInput, { nullable: true })
  theme?: ProjectThemeInput;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectHighlightInput)
  @Field(() => [ProjectHighlightInput], { nullable: true })
  highlights?: ProjectHighlightInput[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CaseStudyInput)
  @Field(() => CaseStudyInput, { nullable: true })
  caseStudy?: CaseStudyInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectPeriodInput)
  @Field(() => ProjectPeriodInput, { nullable: true })
  period?: ProjectPeriodInput;

  /** false = draft, only the admin sees it **/
  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  isPublished?: boolean;
}

/** Public list filter: Projects page tabs and the Home section. */
@InputType()
export class ProjectsInquiry {
  @IsOptional()
  @IsEnum(ProjectCategory)
  @Field(() => ProjectCategory, { nullable: true })
  category?: ProjectCategory;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  showOnHome?: boolean;
}

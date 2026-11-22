import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { Types } from 'mongoose';
import { ProjectCategory, ProjectStatus } from '../../enums/project.enum';
import { LocalizedText, Media } from '../common/common';
import { Skill } from '../skill/skill';

@ObjectType()
export class ProjectHighlight {
  @Field(() => String)
  icon: string;

  @Field(() => LocalizedText)
  label: LocalizedText;
}

@ObjectType()
export class ProjectLinks {
  @Field(() => String, { nullable: true })
  live?: string;

  @Field(() => String, { nullable: true })
  github?: string;

  @Field(() => String, { nullable: true })
  demo?: string;
}

@ObjectType()
export class ProjectMedia {
  @Field(() => Media, { nullable: true })
  cover?: Media;

  @Field(() => Media, { nullable: true })
  thumbnail?: Media;

  @Field(() => [Media], { nullable: true })
  mockups?: Media[];

  @Field(() => [Media], { nullable: true })
  gallery?: Media[];
}

@ObjectType()
export class ProjectTheme {
  @Field(() => String, { nullable: true })
  accent?: string;

  @Field(() => Boolean, { nullable: true })
  dark?: boolean;
}

@ObjectType()
export class CaseStudy {
  @Field(() => LocalizedText, { nullable: true })
  overview?: LocalizedText;

  @Field(() => LocalizedText, { nullable: true })
  problem?: LocalizedText;

  @Field(() => LocalizedText, { nullable: true })
  solution?: LocalizedText;

  @Field(() => LocalizedText, { nullable: true })
  architecture?: LocalizedText;

  @Field(() => [LocalizedText], { nullable: true })
  features?: LocalizedText[];

  @Field(() => [LocalizedText], { nullable: true })
  challenges?: LocalizedText[];

  @Field(() => [LocalizedText], { nullable: true })
  results?: LocalizedText[];

  @Field(() => LocalizedText, { nullable: true })
  role?: LocalizedText;

  @Field(() => Int, { nullable: true })
  teamSize?: number;

  @Field(() => LocalizedText, { nullable: true })
  duration?: LocalizedText;
}

@ObjectType()
export class ProjectPeriod {
  @Field(() => Date, { nullable: true })
  start?: Date;

  @Field(() => Date, { nullable: true })
  end?: Date;
}

@ObjectType()
export class Project {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field(() => String)
  slug: string;

  @Field(() => String)
  title: string;

  @Field(() => LocalizedText)
  subtitle: LocalizedText;

  @Field(() => LocalizedText)
  summary: LocalizedText;

  @Field(() => ProjectCategory)
  category: ProjectCategory;

  @Field(() => ProjectStatus)
  status: ProjectStatus;

  @Field(() => Int)
  order: number;

  @Field(() => Boolean)
  showOnHome: boolean;

  @Field(() => [String])
  skillIds: Types.ObjectId[];

  @Field(() => ProjectLinks, { nullable: true })
  links?: ProjectLinks;

  @Field(() => ProjectMedia, { nullable: true })
  media?: ProjectMedia;

  @Field(() => ProjectTheme, { nullable: true })
  theme?: ProjectTheme;

  @Field(() => [ProjectHighlight])
  highlights: ProjectHighlight[];

  @Field(() => CaseStudy, { nullable: true })
  caseStudy?: CaseStudy;

  @Field(() => ProjectPeriod, { nullable: true })
  period?: ProjectPeriod;

  @Field(() => Boolean)
  isPublished: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  /** from aggregation: the skills used in this project **/
  @Field(() => [Skill], { nullable: true })
  skills?: Skill[];
}

/** Mutation result: success message + the saved project. */
@ObjectType()
export class ProjectResult {
  @Field(() => String)
  message: string;

  @Field(() => Project)
  data: Project;
}

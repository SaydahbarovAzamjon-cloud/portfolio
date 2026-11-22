import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { Types } from 'mongoose';
import { EmploymentType } from '../../enums/experience.enum';
import { LocalizedText, Media } from '../common/common';
import { Skill } from '../skill/skill';

@ObjectType()
export class Experience {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field(() => String)
  company: string;

  @Field(() => Media, { nullable: true })
  companyLogo?: Media;

  @Field(() => Media, { nullable: true })
  companyImage?: Media;

  @Field(() => LocalizedText)
  role: LocalizedText;

  @Field(() => EmploymentType)
  employmentType: EmploymentType;

  @Field(() => LocalizedText, { nullable: true })
  location?: LocalizedText;

  @Field(() => Date)
  startDate: Date;

  /** null = current position **/
  @Field(() => Date, { nullable: true })
  endDate?: Date | null;

  @Field(() => LocalizedText, { nullable: true })
  summary?: LocalizedText;

  @Field(() => [LocalizedText])
  responsibilities: LocalizedText[];

  @Field(() => [LocalizedText])
  achievements: LocalizedText[];

  @Field(() => [String])
  skillIds: Types.ObjectId[];

  @Field(() => [String])
  projectIds: Types.ObjectId[];

  @Field(() => Int)
  order: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  /** from aggregation: the skills used at this job **/
  @Field(() => [Skill], { nullable: true })
  skills?: Skill[];
}

/** Mutation result: success message + the saved experience. */
@ObjectType()
export class ExperienceResult {
  @Field(() => String)
  message: string;

  @Field(() => Experience)
  data: Experience;
}

import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { Types } from 'mongoose';
import { DegreeType, EducationStatus } from '../../enums/education.enum';
import { LocalizedText, Media } from '../common/common';

@ObjectType()
export class Education {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field(() => DegreeType)
  degree: DegreeType;

  @Field(() => LocalizedText)
  institution: LocalizedText;

  @Field(() => String, { nullable: true })
  institutionNative?: string;

  @Field(() => LocalizedText, { nullable: true })
  program?: LocalizedText;

  @Field(() => LocalizedText, { nullable: true })
  major?: LocalizedText;

  @Field(() => LocalizedText, { nullable: true })
  qualification?: LocalizedText;

  @Field(() => LocalizedText, { nullable: true })
  location?: LocalizedText;

  @Field(() => Date)
  startDate: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;

  @Field(() => EducationStatus)
  status: EducationStatus;

  @Field(() => Media, { nullable: true })
  image?: Media;

  @Field(() => Int)
  order: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

/** Mutation result: success message + the saved education. */
@ObjectType()
export class EducationResult {
  @Field(() => String)
  message: string;

  @Field(() => Education)
  data: Education;
}

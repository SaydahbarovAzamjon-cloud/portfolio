import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { Types } from 'mongoose';
import { LocalizedText } from '../common/common';

@ObjectType()
export class Skill {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field(() => String)
  name: string;

  @Field(() => String)
  slug: string;

  @Field(() => String)
  icon: string;

  @Field(() => String)
  categoryId: Types.ObjectId;

  @Field(() => Boolean)
  featured: boolean;

  @Field(() => Int)
  order: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class SkillCategory {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field(() => String)
  key: string;

  @Field(() => LocalizedText)
  title: LocalizedText;

  @Field(() => LocalizedText, { nullable: true })
  description?: LocalizedText;

  @Field(() => String)
  icon: string;

  @Field(() => Int)
  order: number;

  /** from aggregation: the skills in this category **/
  @Field(() => [Skill], { nullable: true })
  skills?: Skill[];
}

/** Mutation results: success message + saved item. */
@ObjectType()
export class SkillResult {
  @Field(() => String)
  message: string;

  @Field(() => Skill)
  data: Skill;
}

@ObjectType()
export class SkillCategoryResult {
  @Field(() => String)
  message: string;

  @Field(() => SkillCategory)
  data: SkillCategory;
}

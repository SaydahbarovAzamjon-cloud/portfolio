import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { LocalizedTextInput } from '../common/common.input';

@InputType()
export class SkillCategoryInput {
  /** Optional: generated from title.en when empty (e.g. "AI & Machine Learning" → "ai-machine-learning"). */
  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @Field(() => String, { nullable: true })
  key?: string;

  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput)
  title: LocalizedTextInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  description?: LocalizedTextInput;

  @IsNotEmpty()
  @Length(1, 100)
  @Field(() => String)
  icon: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: true })
  order?: number;
}

@InputType()
export class SkillInput {
  @IsNotEmpty()
  @Length(1, 50)
  @Field(() => String)
  name: string;

  /** Optional: generated from name when empty ("Next.js" → "nextjs"). */
  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @Field(() => String, { nullable: true })
  slug?: string;

  /** Simple Icons slug, e.g. "nextdotjs", "react", "mongodb". */
  @IsNotEmpty()
  @Length(1, 100)
  @Field(() => String)
  icon: string;

  @IsMongoId()
  @Field(() => String)
  categoryId: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  featured?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: true })
  order?: number;
}

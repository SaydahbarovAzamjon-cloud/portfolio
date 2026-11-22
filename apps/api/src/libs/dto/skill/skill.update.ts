import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsMongoId,
  IsOptional,
  Length,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { LocalizedTextInput } from '../common/common.input';

/** Only the fields you send are changed. */
@InputType()
export class SkillCategoryUpdate {
  @IsMongoId()
  @Field(() => String)
  _id: string;

  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @Field(() => String, { nullable: true })
  key?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  title?: LocalizedTextInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  description?: LocalizedTextInput;

  @IsOptional()
  @Length(1, 100)
  @Field(() => String, { nullable: true })
  icon?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: true })
  order?: number;
}

/** Only the fields you send are changed. */
@InputType()
export class SkillUpdate {
  @IsMongoId()
  @Field(() => String)
  _id: string;

  @IsOptional()
  @Length(1, 50)
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @Field(() => String, { nullable: true })
  slug?: string;

  @IsOptional()
  @Length(1, 100)
  @Field(() => String, { nullable: true })
  icon?: string;

  @IsOptional()
  @IsMongoId()
  @Field(() => String, { nullable: true })
  categoryId?: string;

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

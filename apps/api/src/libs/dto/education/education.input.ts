import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { DegreeType, EducationStatus } from '../../enums/education.enum';
import { LocalizedTextInput, MediaInput } from '../common/common.input';

@InputType()
export class EducationInput {
  @IsEnum(DegreeType)
  @Field(() => DegreeType)
  degree: DegreeType;

  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput)
  institution: LocalizedTextInput;

  @IsOptional()
  @Length(1, 200)
  @Field(() => String, { nullable: true })
  institutionNative?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  program?: LocalizedTextInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  major?: LocalizedTextInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  qualification?: LocalizedTextInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  location?: LocalizedTextInput;

  @IsNotEmpty()
  @Field(() => Date)
  startDate: Date;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  endDate?: Date;

  @IsEnum(EducationStatus)
  @Field(() => EducationStatus)
  status: EducationStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaInput)
  @Field(() => MediaInput, { nullable: true })
  image?: MediaInput;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: true })
  order?: number;
}

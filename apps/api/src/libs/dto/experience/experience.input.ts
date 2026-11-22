import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { EmploymentType } from '../../enums/experience.enum';
import { LocalizedTextInput, MediaInput } from '../common/common.input';

@InputType()
export class ExperienceInput {
  @IsNotEmpty()
  @Length(1, 120)
  @Field(() => String)
  company: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaInput)
  @Field(() => MediaInput, { nullable: true })
  companyLogo?: MediaInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaInput)
  @Field(() => MediaInput, { nullable: true })
  companyImage?: MediaInput;

  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput)
  role: LocalizedTextInput;

  @IsOptional()
  @IsEnum(EmploymentType)
  @Field(() => EmploymentType, { nullable: true })
  employmentType?: EmploymentType;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  location?: LocalizedTextInput;

  @IsNotEmpty()
  @Field(() => Date)
  startDate: Date;

  /** leave empty for the current job **/
  @IsOptional()
  @Field(() => Date, { nullable: true })
  endDate?: Date | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  summary?: LocalizedTextInput;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocalizedTextInput)
  @Field(() => [LocalizedTextInput], { nullable: true })
  responsibilities?: LocalizedTextInput[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocalizedTextInput)
  @Field(() => [LocalizedTextInput], { nullable: true })
  achievements?: LocalizedTextInput[];

  @IsOptional()
  @IsMongoId({ each: true })
  @Field(() => [String], { nullable: true })
  skillIds?: string[];

  @IsOptional()
  @IsMongoId({ each: true })
  @Field(() => [String], { nullable: true })
  projectIds?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: true })
  order?: number;
}

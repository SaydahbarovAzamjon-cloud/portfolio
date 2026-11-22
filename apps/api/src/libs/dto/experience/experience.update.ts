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

/** Only the fields you send are changed. Send endDate: null for the current job. */
@InputType()
export class ExperienceUpdate {
  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  _id: string;

  @IsOptional()
  @Length(1, 120)
  @Field(() => String, { nullable: true })
  company?: string;

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

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  role?: LocalizedTextInput;

  @IsOptional()
  @IsEnum(EmploymentType)
  @Field(() => EmploymentType, { nullable: true })
  employmentType?: EmploymentType;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  location?: LocalizedTextInput;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  startDate?: Date;

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

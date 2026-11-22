import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { DegreeType, EducationStatus } from '../../enums/education.enum';
import { LocalizedTextInput, MediaInput } from '../common/common.input';

/** Only the fields you send are changed. */
@InputType()
export class EducationUpdate {
  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  _id: string;

  @IsOptional()
  @IsEnum(DegreeType)
  @Field(() => DegreeType, { nullable: true })
  degree?: DegreeType;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  institution?: LocalizedTextInput;

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

  @IsOptional()
  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  endDate?: Date;

  @IsOptional()
  @IsEnum(EducationStatus)
  @Field(() => EducationStatus, { nullable: true })
  status?: EducationStatus;

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

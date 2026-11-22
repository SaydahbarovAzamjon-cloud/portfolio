import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';

/** Shared GraphQL input types (mirror schemas/common.ts). */

@InputType()
export class LocalizedTextInput {
  @IsNotEmpty()
  @Length(1, 20000)
  @Field(() => String)
  en: string;

  @IsOptional()
  @Length(0, 20000)
  @Field(() => String, { nullable: true })
  ko?: string;
}

@InputType()
export class MediaInput {
  @IsNotEmpty()
  @Length(1, 1000)
  @Field(() => String)
  url: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  alt?: LocalizedTextInput;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: true })
  width?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: true })
  height?: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  blurDataUrl?: string;
}

@InputType()
export class IconCardInput {
  @IsNotEmpty()
  @Length(1, 100)
  @Field(() => String)
  icon: string;

  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput)
  title: LocalizedTextInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput, { nullable: true })
  description?: LocalizedTextInput;
}

@InputType()
export class StatInput {
  @IsNotEmpty()
  @Length(1, 50)
  @Field(() => String)
  value: string;

  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput)
  label: LocalizedTextInput;
}

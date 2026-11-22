import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Length,
  MaxLength,
} from 'class-validator';
import { PageType } from '../../enums/analytics.enum';
import { Locale } from '../../enums/common.enum';

/** Sent by the frontend on every page open. */
@InputType()
export class TrackVisitInput {
  /** e.g. "/journal/how-i-built-fixora" **/
  @IsNotEmpty()
  @Length(1, 500)
  @Field(() => String)
  path: string;

  @IsEnum(PageType)
  @Field(() => PageType)
  pageType: PageType;

  /** project or article id on detail pages **/
  @IsOptional()
  @IsMongoId()
  @Field(() => String, { nullable: true })
  entityId?: string;

  @IsOptional()
  @IsEnum(Locale)
  @Field(() => Locale, { nullable: true })
  locale?: Locale;

  /** document.referrer: where the visitor came from **/
  @IsOptional()
  @MaxLength(500)
  @Field(() => String, { nullable: true })
  referrer?: string;
}

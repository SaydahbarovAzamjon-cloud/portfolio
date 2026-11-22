import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  ArticleCategory,
  ArticleSort,
  ArticleStatus,
} from '../../enums/article.enum';
import { LocalizedTextInput, MediaInput } from '../common/common.input';

/** Article body (markdown): longer limit than normal text. */
@InputType()
export class ArticleContentInput {
  @IsNotEmpty()
  @Length(1, 200000)
  @Field(() => String)
  en: string;

  @IsOptional()
  @Length(0, 200000)
  @Field(() => String, { nullable: true })
  ko?: string;
}

@InputType()
export class ArticleInput {
  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput)
  title: LocalizedTextInput;

  /** optional: made from title.en when empty **/
  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @Field(() => String, { nullable: true })
  slug?: string;

  @ValidateNested()
  @Type(() => LocalizedTextInput)
  @Field(() => LocalizedTextInput)
  excerpt: LocalizedTextInput;

  @ValidateNested()
  @Type(() => ArticleContentInput)
  @Field(() => ArticleContentInput)
  content: ArticleContentInput;

  @IsEnum(ArticleCategory)
  @Field(() => ArticleCategory)
  category: ArticleCategory;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @Length(1, 40, { each: true })
  @Field(() => [String], { nullable: true })
  tags?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaInput)
  @Field(() => MediaInput, { nullable: true })
  cover?: MediaInput;

  /** DRAFT (default) or PUBLISHED **/
  @IsOptional()
  @IsEnum(ArticleStatus)
  @Field(() => ArticleStatus, { nullable: true })
  status?: ArticleStatus;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  featured?: boolean;
}

/** Public list: Journal page (tabs, tag, search, paging). */
@InputType()
export class ArticlesInquiry {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit?: number;

  @IsOptional()
  @IsEnum(ArticleCategory)
  @Field(() => ArticleCategory, { nullable: true })
  category?: ArticleCategory;

  @IsOptional()
  @Length(1, 40)
  @Field(() => String, { nullable: true })
  tag?: string;

  @IsOptional()
  @Length(1, 100)
  @Field(() => String, { nullable: true })
  search?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  featured?: boolean;

  @IsOptional()
  @IsEnum(ArticleSort)
  @Field(() => ArticleSort, {
    nullable: true,
    defaultValue: ArticleSort.LATEST,
  })
  sort?: ArticleSort;
}

/** Admin list: same filters + status (drafts too). */
@InputType()
export class AllArticlesInquiry extends ArticlesInquiry {
  @IsOptional()
  @IsEnum(ArticleStatus)
  @Field(() => ArticleStatus, { nullable: true })
  status?: ArticleStatus;
}

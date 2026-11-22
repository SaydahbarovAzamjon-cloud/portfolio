import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { Types } from 'mongoose';
import {
  ArticleCategory,
  ArticleStatus,
  TranslationStatus,
} from '../../enums/article.enum';
import { LocalizedText, Media, TotalCounter } from '../common/common';

@ObjectType()
export class ReadingTime {
  @Field(() => Int, { nullable: true })
  en?: number;

  @Field(() => Int, { nullable: true })
  ko?: number;
}

@ObjectType()
export class KoTranslation {
  @Field(() => TranslationStatus, { nullable: true })
  status?: TranslationStatus;

  @Field(() => Date, { nullable: true })
  translatedAt?: Date;

  @Field(() => String, { nullable: true })
  model?: string;
}

@ObjectType()
export class ArticleTranslation {
  @Field(() => KoTranslation, { nullable: true })
  ko?: KoTranslation;
}

@ObjectType()
export class Article {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field(() => String)
  slug: string;

  @Field(() => LocalizedText)
  title: LocalizedText;

  @Field(() => LocalizedText)
  excerpt: LocalizedText;

  /** Markdown. Not included in lists (getArticles), only in single article. */
  @Field(() => LocalizedText, { nullable: true })
  content?: LocalizedText;

  @Field(() => ArticleCategory)
  category: ArticleCategory;

  @Field(() => [String])
  tags: string[];

  @Field(() => Media, { nullable: true })
  cover?: Media;

  @Field(() => ArticleStatus)
  status: ArticleStatus;

  @Field(() => Date, { nullable: true })
  publishedAt?: Date;

  @Field(() => Boolean)
  featured: boolean;

  @Field(() => ReadingTime, { nullable: true })
  readingTime?: ReadingTime;

  @Field(() => ArticleTranslation, { nullable: true })
  translation?: ArticleTranslation;

  @Field(() => Int)
  viewCount: number;

  @Field(() => Int)
  likeCount: number;

  @Field(() => Int)
  commentCount: number;

  @Field(() => Int)
  shareCount: number;

  @Field(() => String, { nullable: true })
  authorId?: Types.ObjectId;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  /** only in getArticle: did this visitor like it **/
  @Field(() => Boolean, { nullable: true })
  meLiked?: boolean;
}

/** Paginated list: list + metaCounter[0].total */
@ObjectType()
export class Articles {
  @Field(() => [Article])
  list: Article[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}

@ObjectType()
export class ArticleResult {
  @Field(() => String)
  message: string;

  @Field(() => Article)
  data: Article;
}

@ObjectType()
export class ArticleLike {
  @Field(() => String)
  articleId: string;

  @Field(() => Boolean)
  liked: boolean;

  @Field(() => Int)
  likeCount: number;
}

@ObjectType()
export class ArticleLikeResult {
  @Field(() => String)
  message: string;

  @Field(() => ArticleLike)
  data: ArticleLike;
}

@ObjectType()
export class ArticleShareResult {
  @Field(() => String)
  message: string;

  @Field(() => Int)
  shareCount: number;
}

@ObjectType()
export class CategoryCount {
  @Field(() => ArticleCategory)
  category: ArticleCategory;

  @Field(() => Int)
  count: number;
}

/** Journal header numbers + category tab counts (published articles only). */
@ObjectType()
export class JournalStats {
  @Field(() => Int)
  totalArticles: number;

  @Field(() => Int)
  totalViews: number;

  @Field(() => Int)
  totalLikes: number;

  @Field(() => Int)
  totalComments: number;

  @Field(() => Int)
  totalShares: number;

  @Field(() => [CategoryCount])
  categories: CategoryCount[];
}

import { registerEnumType } from '@nestjs/graphql';

/** Exactly four journal categories (project brief §3.6). */
export enum ArticleCategory {
  DEVELOPMENT = 'DEVELOPMENT',
  AI_ML = 'AI_ML',
  PERSONAL = 'PERSONAL',
  FREELANCE = 'FREELANCE',
}
registerEnumType(ArticleCategory, { name: 'ArticleCategory' });

export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}
registerEnumType(ArticleStatus, { name: 'ArticleStatus' });

/** Journal list order ("Latest First" dropdown). */
export enum ArticleSort {
  LATEST = 'LATEST',
  OLDEST = 'OLDEST',
  MOST_VIEWED = 'MOST_VIEWED',
  MOST_LIKED = 'MOST_LIKED',
}
registerEnumType(ArticleSort, { name: 'ArticleSort' });

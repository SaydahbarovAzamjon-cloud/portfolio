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

export enum TranslationStatus {
  NONE = 'NONE',
  AI = 'AI',
  REVIEWED = 'REVIEWED',
}
registerEnumType(TranslationStatus, { name: 'TranslationStatus' });

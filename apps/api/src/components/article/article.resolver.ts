import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  Article,
  ArticleLikeResult,
  ArticleResult,
  Articles,
  ArticleShareResult,
  JournalStats,
} from '../../libs/dto/article/article';
import {
  AllArticlesInquiry,
  ArticleInput,
  ArticlesInquiry,
} from '../../libs/dto/article/article.input';
import { ArticleUpdate } from '../../libs/dto/article/article.update';
import { UserRole } from '../../libs/enums/user.enum';
import type { GqlContext } from '../../libs/types/auth';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GqlThrottlerGuard } from '../auth/guards/throttler.guard';
import { ArticleService } from './article.service';

@Resolver()
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  /** Public: Journal list (category / tag / search / featured, paging). */
  @Query(() => Articles)
  public async getArticles(
    @Args('input', { nullable: true }) input?: ArticlesInquiry,
  ): Promise<Articles> {
    return await this.articleService.getArticles(input ?? {});
  }

  /** Public: Journal header numbers and category tab counts. */
  @Query(() => JournalStats)
  public async getJournalStats(): Promise<JournalStats> {
    return await this.articleService.getJournalStats();
  }

  /** Public: one article page (counts the view). */
  @Query(() => Article)
  public async getArticle(
    @Args('slug') slug: string,
    @Context() { req, res }: GqlContext,
  ): Promise<Article> {
    return await this.articleService.getArticle(slug, req, res);
  }

  /** Public: count a share (rate limited). */
  @UseGuards(GqlThrottlerGuard)
  @Mutation(() => ArticleShareResult)
  public async shareArticle(
    @Args('articleId') articleId: string,
  ): Promise<ArticleShareResult> {
    return await this.articleService.shareArticle(articleId);
  }

  /** Public: like / unlike. */
  @Mutation(() => ArticleLikeResult)
  public async likeArticle(
    @Args('articleId') articleId: string,
    @Context() { req, res }: GqlContext,
  ): Promise<ArticleLikeResult> {
    return await this.articleService.likeArticle(articleId, req, res);
  }

  /*** ADMIN ***/

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => Articles)
  public async getAllArticlesByAdmin(
    @Args('input', { nullable: true }) input?: AllArticlesInquiry,
  ): Promise<Articles> {
    return await this.articleService.getAllArticlesByAdmin(input ?? {});
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => Article)
  public async getArticleByAdmin(
    @Args('articleId') articleId: string,
  ): Promise<Article> {
    return await this.articleService.getArticleByAdmin(articleId);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => ArticleResult)
  public async createArticleByAdmin(
    @Args('input') input: ArticleInput,
    @AuthMember('_id') authorId: string,
  ): Promise<ArticleResult> {
    return await this.articleService.createArticleByAdmin(input, authorId);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => ArticleResult)
  public async updateArticleByAdmin(
    @Args('input') input: ArticleUpdate,
  ): Promise<ArticleResult> {
    return await this.articleService.updateArticleByAdmin(input);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => ArticleResult)
  public async removeArticleByAdmin(
    @Args('articleId') articleId: string,
  ): Promise<ArticleResult> {
    return await this.articleService.removeArticleByAdmin(articleId);
  }
}

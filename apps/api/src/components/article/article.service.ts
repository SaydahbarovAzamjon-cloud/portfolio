import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Response } from 'express';
import { isValidObjectId, Model, PipelineStage, Types } from 'mongoose';
import { isDuplicateKeyError, toSlug } from '../../libs/config';
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
import {
  ArticleCategory,
  ArticleSort,
  ArticleStatus,
} from '../../libs/enums/article.enum';
import { Message } from '../../libs/enums/common.enum';
import type { AuthRequest } from '../../libs/types/auth';
import { ensureVisitorId } from '../../libs/visitor';

/** Like and ArticleView rows: one per visitor per article. */
interface VisitorMark {
  articleId: Types.ObjectId;
  visitorId: string;
}

const SORTS: Record<ArticleSort, Record<string, 1 | -1>> = {
  [ArticleSort.LATEST]: { publishedAt: -1, _id: -1 },
  [ArticleSort.OLDEST]: { publishedAt: 1, _id: 1 },
  [ArticleSort.MOST_VIEWED]: { viewCount: -1, publishedAt: -1 },
  [ArticleSort.MOST_LIKED]: { likeCount: -1, publishedAt: -1 },
};

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    @InjectModel('Article') private readonly articleModel: Model<Article>,
    @InjectModel('Like') private readonly likeModel: Model<VisitorMark>,
    @InjectModel('ArticleView')
    private readonly viewModel: Model<VisitorMark>,
    @InjectModel('Comment') private readonly commentModel: Model<unknown>,
  ) {}

  /** Published articles without the body (default: newest first). */
  public async getArticles(input: ArticlesInquiry): Promise<Articles> {
    const match = this.buildMatch(input);
    match.status = ArticleStatus.PUBLISHED;

    return await this.paginate(
      input,
      match,
      SORTS[input.sort ?? ArticleSort.LATEST],
    );
  }

  /** Journal header (articles / views / likes ...) and category tab counts. */
  public async getJournalStats(): Promise<JournalStats> {
    const [result] = await this.articleModel
      .aggregate<{
        totals: Omit<JournalStats, 'categories'>[];
        categories: { _id: ArticleCategory; count: number }[];
      }>([
        { $match: { status: ArticleStatus.PUBLISHED } },
        {
          $facet: {
            totals: [
              {
                $group: {
                  _id: null,
                  totalArticles: { $sum: 1 },
                  totalViews: { $sum: '$viewCount' },
                  totalLikes: { $sum: '$likeCount' },
                  totalComments: { $sum: '$commentCount' },
                  totalShares: { $sum: '$shareCount' },
                },
              },
            ],
            categories: [{ $group: { _id: '$category', count: { $sum: 1 } } }],
          },
        },
      ])
      .exec();

    const totals = result?.totals[0];
    const counts = new Map(result?.categories.map((c) => [c._id, c.count]));
    return {
      totalArticles: totals?.totalArticles ?? 0,
      totalViews: totals?.totalViews ?? 0,
      totalLikes: totals?.totalLikes ?? 0,
      totalComments: totals?.totalComments ?? 0,
      totalShares: totals?.totalShares ?? 0,
      categories: Object.values(ArticleCategory).map((category) => ({
        category,
        count: counts.get(category) ?? 0,
      })),
    };
  }

  /** One published article by slug. A view counts once per visitor per 24h. */
  public async getArticle(
    slug: string,
    req: AuthRequest,
    res: Response,
  ): Promise<Article> {
    // 1. find
    const result = await this.articleModel
      .findOne({ slug: slug.toLowerCase(), status: ArticleStatus.PUBLISHED })
      .lean()
      .exec();
    if (!result) throw new NotFoundException(Message.NO_DATA_FOUND);

    // 2. count the view (skip if this visitor saw it in the last 24h)
    const visitorId = ensureVisitorId(req, res);
    try {
      await this.viewModel.create({ articleId: result._id, visitorId });
      await this.articleModel
        .updateOne({ _id: result._id }, { $inc: { viewCount: 1 } })
        .exec();
      result.viewCount += 1;
    } catch (err) {
      if (!isDuplicateKeyError(err)) throw err;
    }

    // 3. did this visitor like it
    const meLiked = !!(await this.likeModel
      .exists({ articleId: result._id, visitorId })
      .exec());

    return { ...result, meLiked };
  }

  /** Counts a share (the frontend opens the share link / copies the URL). */
  public async shareArticle(articleId: string): Promise<ArticleShareResult> {
    if (!isValidObjectId(articleId)) {
      throw new BadRequestException(Message.BAD_REQUEST);
    }

    const result = await this.articleModel
      .findOneAndUpdate(
        { _id: articleId, status: ArticleStatus.PUBLISHED },
        { $inc: { shareCount: 1 } },
        { new: true },
      )
      .lean()
      .exec();
    if (!result) throw new NotFoundException(Message.NO_DATA_FOUND);

    return { message: Message.SHARE_SUCCESS, shareCount: result.shareCount };
  }

  /** Like / unlike (toggle). One like per visitor per article. */
  public async likeArticle(
    articleId: string,
    req: AuthRequest,
    res: Response,
  ): Promise<ArticleLikeResult> {
    // 1. article must be published
    if (!isValidObjectId(articleId)) {
      throw new BadRequestException(Message.BAD_REQUEST);
    }
    const exists = await this.articleModel
      .exists({ _id: articleId, status: ArticleStatus.PUBLISHED })
      .exec();
    if (!exists) throw new NotFoundException(Message.NO_DATA_FOUND);

    // 2. remove the like if it exists, otherwise add it
    const visitorId = ensureVisitorId(req, res);
    const removed = await this.likeModel
      .deleteOne({ articleId, visitorId })
      .exec();

    let liked = false;
    if (removed.deletedCount === 0) {
      try {
        await this.likeModel.create({ articleId, visitorId });
        liked = true;
      } catch (err) {
        // double click: the like is already there
        if (!isDuplicateKeyError(err)) throw err;
        return await this.likeResult(articleId, true);
      }
    }

    // 3. update the counter
    const article = await this.articleModel
      .findByIdAndUpdate(
        articleId,
        { $inc: { likeCount: liked ? 1 : -1 } },
        { new: true },
      )
      .lean()
      .exec();

    return {
      message: liked ? Message.LIKE_ADDED : Message.LIKE_REMOVED,
      data: { articleId, liked, likeCount: article?.likeCount ?? 0 },
    };
  }

  /*** ADMIN ***/

  /** All articles (drafts too), last edited first, without the body. */
  public async getAllArticlesByAdmin(
    input: AllArticlesInquiry,
  ): Promise<Articles> {
    const match = this.buildMatch(input);
    if (input.status) match.status = input.status;
    const sort = input.sort ? SORTS[input.sort] : { updatedAt: -1 as const };

    return await this.paginate(input, match, sort);
  }

  /** One article with the body, for the edit form. */
  public async getArticleByAdmin(articleId: string): Promise<Article> {
    if (!isValidObjectId(articleId)) {
      throw new BadRequestException(Message.BAD_REQUEST);
    }
    const result = await this.articleModel.findById(articleId).lean().exec();
    if (!result) throw new NotFoundException(Message.NO_DATA_FOUND);

    return result;
  }

  public async createArticleByAdmin(
    input: ArticleInput,
    authorId: string,
  ): Promise<ArticleResult> {
    // 1. slug from the English title when not given
    const slug = input.slug ?? toSlug(input.title.en);
    if (!slug) throw new BadRequestException(Message.BAD_REQUEST);

    // 2. save (reading time and publishedAt are set by the schema)
    try {
      const result = await this.articleModel.create({
        ...input,
        tags: this.cleanTags(input.tags),
        slug,
        authorId,
      });
      return { message: Message.CREATE_SUCCESS, data: result };
    } catch (err) {
      throw this.handleWriteError('createArticle', err, Message.CREATE_FAILED);
    }
  }

  public async updateArticleByAdmin(
    input: ArticleUpdate,
  ): Promise<ArticleResult> {
    const { _id, ...fields } = input;

    // 1. find
    const article = await this.articleModel.findById(_id).exec();
    if (!article) throw new NotFoundException(Message.NO_DATA_FOUND);

    // 2. change and save (save() recalculates reading time / publishedAt)
    if (fields.tags) fields.tags = this.cleanTags(fields.tags);
    article.set(fields);

    try {
      const result = await article.save();
      return { message: Message.UPDATE_SUCCESS, data: result.toObject() };
    } catch (err) {
      throw this.handleWriteError('updateArticle', err, Message.UPDATE_FAILED);
    }
  }

  /** Removes the article with its comments and likes. */
  public async removeArticleByAdmin(articleId: string): Promise<ArticleResult> {
    if (!isValidObjectId(articleId)) {
      throw new BadRequestException(Message.BAD_REQUEST);
    }

    const result = await this.articleModel
      .findByIdAndDelete(articleId)
      .lean()
      .exec();
    if (!result) throw new NotFoundException(Message.NO_DATA_FOUND);

    await Promise.all([
      this.commentModel.deleteMany({ articleId }).exec(),
      this.likeModel.deleteMany({ articleId }).exec(),
      this.viewModel.deleteMany({ articleId }).exec(),
    ]);

    return { message: Message.REMOVE_SUCCESS, data: result };
  }

  /*** HELPERS ***/

  private buildMatch(input: ArticlesInquiry): Record<string, unknown> {
    const match: Record<string, unknown> = {};
    if (input.search) match.$text = { $search: input.search };
    if (input.category) match.category = input.category;
    if (input.tag) match.tags = input.tag.trim().toLowerCase();
    if (input.featured !== undefined) match.featured = input.featured;
    return match;
  }

  private async paginate(
    input: ArticlesInquiry,
    match: Record<string, unknown>,
    sort: Record<string, 1 | -1>,
  ): Promise<Articles> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;

    const pipeline: PipelineStage[] = [
      { $match: match },
      { $sort: sort },
      {
        $facet: {
          list: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            { $project: { content: 0 } },
          ],
          metaCounter: [{ $count: 'total' }],
        },
      },
    ];
    const [result] = await this.articleModel
      .aggregate<Articles>(pipeline)
      .exec();

    return result ?? { list: [], metaCounter: [] };
  }

  private async likeResult(
    articleId: string,
    liked: boolean,
  ): Promise<ArticleLikeResult> {
    const article = await this.articleModel.findById(articleId).lean().exec();
    return {
      message: liked ? Message.LIKE_ADDED : Message.LIKE_REMOVED,
      data: { articleId, liked, likeCount: article?.likeCount ?? 0 },
    };
  }

  /** Lowercase, trimmed, no duplicates: "Next.js " → "next.js". */
  private cleanTags(tags?: string[]): string[] {
    if (!tags) return [];
    return [...new Set(tags.map((t) => t.trim().toLowerCase()))].filter(
      Boolean,
    );
  }

  private handleWriteError(
    where: string,
    err: unknown,
    message: Message,
  ): Error {
    if (err instanceof NotFoundException) return err;
    if (isDuplicateKeyError(err)) {
      return new ConflictException(Message.ALREADY_EXISTS);
    }
    this.logger.error(`${where}: ${(err as Error).message}`);
    return new BadRequestException(message);
  }
}

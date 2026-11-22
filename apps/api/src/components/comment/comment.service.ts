import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Response } from 'express';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Article } from '../../libs/dto/article/article';
import {
  Comment,
  CommentResult,
  Comments,
} from '../../libs/dto/comment/comment';
import {
  CommentInput,
  CommentReplyInput,
  CommentsInquiry,
} from '../../libs/dto/comment/comment.input';
import { CommentStatusUpdate } from '../../libs/dto/comment/comment.update';
import { Profile } from '../../libs/dto/profile/profile';
import { ArticleStatus } from '../../libs/enums/article.enum';
import { CommentStatus } from '../../libs/enums/comment.enum';
import { Message } from '../../libs/enums/common.enum';
import type { AuthRequest } from '../../libs/types/auth';
import { ensureVisitorId } from '../../libs/visitor';
import { NotificationService } from '../notification/notification.service';

/** Stored comment: public fields + private ones (never exposed). */
type CommentDoc = Comment & { visitorId?: string; userAgent?: string };

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<CommentDoc>,
    @InjectModel('Article') private readonly articleModel: Model<Article>,
    @InjectModel('Profile') private readonly profileModel: Model<Profile>,
    private readonly notificationService: NotificationService,
  ) {}

  /** Approved comments of an article, oldest first, replies nested. */
  public async getComments(articleId: string): Promise<Comment[]> {
    if (!isValidObjectId(articleId)) {
      throw new BadRequestException(Message.BAD_REQUEST);
    }

    const all = await this.commentModel
      .find({ articleId, status: CommentStatus.APPROVED })
      .sort({ createdAt: 1 })
      .lean()
      .exec();

    const topLevel = all.filter((c) => !c.parentId);
    return topLevel.map((comment) => ({
      ...comment,
      replies: all.filter((c) => String(c.parentId) === String(comment._id)),
    }));
  }

  /** Visitor writes a comment. It waits for admin approval. */
  public async createComment(
    input: CommentInput,
    req: AuthRequest,
    res: Response,
  ): Promise<CommentResult> {
    // 1. article must be published
    const article = await this.articleModel
      .findOne({ _id: input.articleId, status: ArticleStatus.PUBLISHED })
      .select('title')
      .lean()
      .exec();
    if (!article) throw new NotFoundException(Message.NO_DATA_FOUND);

    // 2. replies only to an approved top-level comment of the same article
    if (input.parentId) {
      const parent = await this.commentModel
        .exists({
          _id: input.parentId,
          articleId: input.articleId,
          parentId: null,
          status: CommentStatus.APPROVED,
        })
        .exec();
      if (!parent) throw new BadRequestException(Message.REPLY_NOT_ALLOWED);
    }

    // 3. save as PENDING
    const result = await this.commentModel.create({
      ...input,
      status: CommentStatus.PENDING,
      visitorId: ensureVisitorId(req, res),
      userAgent: req.headers['user-agent']?.slice(0, 300),
    });

    // 4. tell the owner (does not wait, never fails the request)
    void this.notificationService.sendTelegram(
      [
        '💬 New comment (waiting for review)',
        `Article: ${article.title.en}`,
        `From: ${input.authorName}${input.authorEmail ? ` <${input.authorEmail}>` : ''}`,
        '',
        input.content,
      ].join('\n'),
    );

    return { message: Message.COMMENT_SENT, data: result.toObject() };
  }

  /*** ADMIN ***/

  /** All comments (newest first) with article title and email. */
  public async getCommentsByAdmin(input: CommentsInquiry): Promise<Comments> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;

    const match: Record<string, unknown> = {};
    if (input.status) match.status = input.status;
    if (input.articleId) match.articleId = new Types.ObjectId(input.articleId);

    const [result] = await this.commentModel
      .aggregate<Comments>([
        { $match: match },
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            list: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              { $project: { ipHash: 0, userAgent: 0 } },
              {
                $lookup: {
                  from: 'articles',
                  localField: 'articleId',
                  foreignField: '_id',
                  pipeline: [{ $project: { slug: 1, title: 1 } }],
                  as: 'article',
                },
              },
              {
                $unwind: { path: '$article', preserveNullAndEmptyArrays: true },
              },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    return result ?? { list: [], metaCounter: [] };
  }

  /** Approve / reject / spam. Keeps the article's commentCount right. */
  public async updateCommentStatusByAdmin(
    input: CommentStatusUpdate,
  ): Promise<CommentResult> {
    // 1. find and change
    const before = await this.commentModel
      .findByIdAndUpdate(input._id, { $set: { status: input.status } })
      .lean()
      .exec();
    if (!before) throw new NotFoundException(Message.NO_DATA_FOUND);

    // 2. update the counter only when "approved" changes
    const wasApproved = before.status === CommentStatus.APPROVED;
    const isApproved = input.status === CommentStatus.APPROVED;
    if (wasApproved !== isApproved) {
      await this.changeCommentCount(before.articleId, isApproved ? 1 : -1);
    }

    return {
      message: Message.UPDATE_SUCCESS,
      data: { ...before, status: input.status },
    };
  }

  /** Owner reply. Also approves the comment it answers. */
  public async replyCommentByAdmin(
    input: CommentReplyInput,
  ): Promise<CommentResult> {
    // 1. find the comment (a reply to a reply goes under the same top-level comment)
    const target = await this.commentModel
      .findById(input.commentId)
      .lean()
      .exec();
    if (!target) throw new NotFoundException(Message.NO_DATA_FOUND);
    const parentId = target.parentId ?? target._id;

    // 2. approve the answered comment if needed
    if (target.status !== CommentStatus.APPROVED) {
      await this.updateCommentStatusByAdmin({
        _id: String(target._id),
        status: CommentStatus.APPROVED,
      });
    }

    // 3. save the reply with the owner's name
    const profile = await this.profileModel
      .findOne()
      .select('name')
      .lean()
      .exec();
    const result = await this.commentModel.create({
      articleId: target.articleId,
      parentId,
      authorName: profile?.name ?? 'Admin',
      content: input.content,
      status: CommentStatus.APPROVED,
      isOwnerReply: true,
    });
    await this.changeCommentCount(target.articleId, 1);

    return { message: Message.CREATE_SUCCESS, data: result.toObject() };
  }

  /** Removes a comment with its replies. */
  public async removeCommentByAdmin(commentId: string): Promise<CommentResult> {
    if (!isValidObjectId(commentId)) {
      throw new BadRequestException(Message.BAD_REQUEST);
    }

    // 1. the comment and its replies
    const comment = await this.commentModel.findById(commentId).lean().exec();
    if (!comment) throw new NotFoundException(Message.NO_DATA_FOUND);
    const filter = { $or: [{ _id: comment._id }, { parentId: comment._id }] };

    // 2. count approved ones, then delete
    const approved = await this.commentModel
      .countDocuments({ ...filter, status: CommentStatus.APPROVED })
      .exec();
    await this.commentModel.deleteMany(filter).exec();
    if (approved) await this.changeCommentCount(comment.articleId, -approved);

    return { message: Message.REMOVE_SUCCESS, data: comment };
  }

  /*** HELPERS ***/

  private async changeCommentCount(
    articleId: Types.ObjectId,
    by: number,
  ): Promise<void> {
    await this.articleModel
      .updateOne({ _id: articleId }, { $inc: { commentCount: by } })
      .exec();
  }
}

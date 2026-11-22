import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
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
import { UserRole } from '../../libs/enums/user.enum';
import type { GqlContext } from '../../libs/types/auth';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GqlThrottlerGuard } from '../auth/guards/throttler.guard';
import { CommentService } from './comment.service';

@Resolver()
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  /** Public: approved comments with replies. */
  @Query(() => [Comment])
  public async getComments(
    @Args('articleId') articleId: string,
  ): Promise<Comment[]> {
    return await this.commentService.getComments(articleId);
  }

  /** Public: write a comment (rate limited). */
  @UseGuards(GqlThrottlerGuard)
  @Mutation(() => CommentResult)
  public async createComment(
    @Args('input') input: CommentInput,
    @Context() { req, res }: GqlContext,
  ): Promise<CommentResult> {
    return await this.commentService.createComment(input, req, res);
  }

  /*** ADMIN ***/

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => Comments)
  public async getCommentsByAdmin(
    @Args('input', { nullable: true }) input?: CommentsInquiry,
  ): Promise<Comments> {
    return await this.commentService.getCommentsByAdmin(input ?? {});
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => CommentResult)
  public async updateCommentStatusByAdmin(
    @Args('input') input: CommentStatusUpdate,
  ): Promise<CommentResult> {
    return await this.commentService.updateCommentStatusByAdmin(input);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => CommentResult)
  public async replyCommentByAdmin(
    @Args('input') input: CommentReplyInput,
  ): Promise<CommentResult> {
    return await this.commentService.replyCommentByAdmin(input);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => CommentResult)
  public async removeCommentByAdmin(
    @Args('commentId') commentId: string,
  ): Promise<CommentResult> {
    return await this.commentService.removeCommentByAdmin(commentId);
  }
}

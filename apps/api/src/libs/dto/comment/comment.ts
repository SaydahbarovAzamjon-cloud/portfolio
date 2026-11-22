import { Field, ObjectType } from '@nestjs/graphql';
import type { Types } from 'mongoose';
import { CommentStatus } from '../../enums/comment.enum';
import { LocalizedText, TotalCounter } from '../common/common';

/** Short article info shown next to a comment in the admin panel. */
@ObjectType()
export class CommentArticle {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field(() => String)
  slug: string;

  @Field(() => LocalizedText)
  title: LocalizedText;
}

@ObjectType()
export class Comment {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field(() => String)
  articleId: Types.ObjectId;

  /** null = top-level comment **/
  @Field(() => String, { nullable: true })
  parentId?: Types.ObjectId | null;

  @Field(() => String)
  authorName: string;

  /** admin only (never returned by public queries) **/
  @Field(() => String, { nullable: true })
  authorEmail?: string;

  @Field(() => String)
  content: string;

  @Field(() => CommentStatus)
  status: CommentStatus;

  @Field(() => Boolean)
  isOwnerReply: boolean;

  @Field(() => Date)
  createdAt: Date;

  /** public getComments: replies under each top-level comment **/
  @Field(() => [Comment], { nullable: true })
  replies?: Comment[];

  /** admin list: which article **/
  @Field(() => CommentArticle, { nullable: true })
  article?: CommentArticle;
}

@ObjectType()
export class Comments {
  @Field(() => [Comment])
  list: Comment[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}

@ObjectType()
export class CommentResult {
  @Field(() => String)
  message: string;

  @Field(() => Comment)
  data: Comment;
}

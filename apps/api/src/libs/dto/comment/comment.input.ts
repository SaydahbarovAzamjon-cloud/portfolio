import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Length,
  Max,
  Min,
} from 'class-validator';
import { CommentStatus } from '../../enums/comment.enum';

/** Visitor's comment (or reply to an approved top-level comment). */
@InputType()
export class CommentInput {
  @IsMongoId()
  @Field(() => String)
  articleId: string;

  @IsOptional()
  @IsMongoId()
  @Field(() => String, { nullable: true })
  parentId?: string;

  @IsNotEmpty()
  @Length(1, 80)
  @Field(() => String)
  authorName: string;

  /** optional, private: only the admin sees it **/
  @IsOptional()
  @IsEmail()
  @Field(() => String, { nullable: true })
  authorEmail?: string;

  @IsNotEmpty()
  @Length(1, 2000)
  @Field(() => String)
  content: string;
}

/** Admin list: filter by status / article, paging. */
@InputType()
export class CommentsInquiry {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Field(() => Int, { nullable: true, defaultValue: 20 })
  limit?: number;

  @IsOptional()
  @IsEnum(CommentStatus)
  @Field(() => CommentStatus, { nullable: true })
  status?: CommentStatus;

  @IsOptional()
  @IsMongoId()
  @Field(() => String, { nullable: true })
  articleId?: string;
}

/** Admin reply, shown as the site owner. */
@InputType()
export class CommentReplyInput {
  @IsMongoId()
  @Field(() => String)
  commentId: string;

  @IsNotEmpty()
  @Length(1, 2000)
  @Field(() => String)
  content: string;
}

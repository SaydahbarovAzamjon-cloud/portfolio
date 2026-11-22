import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsMongoId } from 'class-validator';
import { CommentStatus } from '../../enums/comment.enum';

/** Approve / reject / mark as spam. */
@InputType()
export class CommentStatusUpdate {
  @IsMongoId()
  @Field(() => String)
  _id: string;

  @IsEnum(CommentStatus)
  @Field(() => CommentStatus)
  status: CommentStatus;
}

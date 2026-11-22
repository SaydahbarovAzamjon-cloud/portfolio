import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ArticleInput } from './article.input';

/** Same fields as ArticleInput, all optional. Only the fields you send are changed. */
@InputType()
export class ArticleUpdate extends PartialType(ArticleInput) {
  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  _id: string;
}

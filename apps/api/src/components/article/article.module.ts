import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ArticleSchema from '../../schemas/Article.model';
import ArticleViewSchema from '../../schemas/ArticleView.model';
import CommentSchema from '../../schemas/Comment.model';
import LikeSchema from '../../schemas/Like.model';
import { AuthModule } from '../auth/auth.module';
import { NotificationModule } from '../notification/notification.module';
import { ArticleResolver } from './article.resolver';
import { ArticleService } from './article.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Article', schema: ArticleSchema },
      { name: 'Comment', schema: CommentSchema },
      { name: 'Like', schema: LikeSchema },
      { name: 'ArticleView', schema: ArticleViewSchema },
    ]),
    AuthModule,
    NotificationModule,
  ],
  providers: [ArticleResolver, ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}

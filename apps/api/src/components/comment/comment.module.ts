import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ArticleSchema from '../../schemas/Article.model';
import CommentSchema from '../../schemas/Comment.model';
import ProfileSchema from '../../schemas/Profile.model';
import { AuthModule } from '../auth/auth.module';
import { NotificationModule } from '../notification/notification.module';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Comment', schema: CommentSchema },
      { name: 'Article', schema: ArticleSchema },
      { name: 'Profile', schema: ProfileSchema },
    ]),
    AuthModule,
    NotificationModule,
  ],
  providers: [CommentResolver, CommentService],
  exports: [CommentService],
})
export class CommentModule {}

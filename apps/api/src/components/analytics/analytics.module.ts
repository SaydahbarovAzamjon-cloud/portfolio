import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import CommentSchema from '../../schemas/Comment.model';
import ContactMessageSchema from '../../schemas/ContactMessage.model';
import PageViewSchema from '../../schemas/PageView.model';
import VisitorSchema from '../../schemas/Visitor.model';
import { AuthModule } from '../auth/auth.module';
import { AnalyticsResolver } from './analytics.resolver';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PageView', schema: PageViewSchema },
      { name: 'Visitor', schema: VisitorSchema },
      { name: 'Comment', schema: CommentSchema },
      { name: 'ContactMessage', schema: ContactMessageSchema },
    ]),
    AuthModule,
  ],
  providers: [AnalyticsResolver, AnalyticsService],
})
export class AnalyticsModule {}

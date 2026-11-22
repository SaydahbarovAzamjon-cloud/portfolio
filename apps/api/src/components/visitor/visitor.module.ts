import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import PageViewSchema from '../../schemas/PageView.model';
import VisitorSchema from '../../schemas/Visitor.model';
import { AuthModule } from '../auth/auth.module';
import { NotificationModule } from '../notification/notification.module';
import { VisitorResolver } from './visitor.resolver';
import { VisitorService } from './visitor.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Visitor', schema: VisitorSchema },
      { name: 'PageView', schema: PageViewSchema },
    ]),
    AuthModule,
    NotificationModule,
  ],
  providers: [VisitorResolver, VisitorService],
  exports: [VisitorService],
})
export class VisitorModule {}

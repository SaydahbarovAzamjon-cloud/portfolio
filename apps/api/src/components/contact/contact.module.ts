import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ContactMessageSchema from '../../schemas/ContactMessage.model';
import { AuthModule } from '../auth/auth.module';
import { NotificationModule } from '../notification/notification.module';
import { ContactResolver } from './contact.resolver';
import { ContactService } from './contact.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ContactMessage', schema: ContactMessageSchema },
    ]),
    AuthModule,
    NotificationModule,
  ],
  providers: [ContactResolver, ContactService],
  exports: [ContactService],
})
export class ContactModule {}

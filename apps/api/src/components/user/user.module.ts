import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import UserSchema from '../../schemas/User.model';
import { AuthModule } from '../auth/auth.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AuthModule,
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ProfileSchema from '../../schemas/Profile.model';
import { AuthModule } from '../auth/auth.module';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }]),
    AuthModule,
  ],
  providers: [ProfileResolver, ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}

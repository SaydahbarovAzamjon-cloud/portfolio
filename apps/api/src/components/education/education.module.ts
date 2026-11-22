import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import EducationSchema from '../../schemas/Education.model';
import { AuthModule } from '../auth/auth.module';
import { EducationResolver } from './education.resolver';
import { EducationService } from './education.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Education', schema: EducationSchema }]),
    AuthModule,
  ],
  providers: [EducationResolver, EducationService],
  exports: [EducationService],
})
export class EducationModule {}

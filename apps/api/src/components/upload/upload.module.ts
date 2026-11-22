import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import UploadSchema from '../../schemas/Upload.model';
import { AuthModule } from '../auth/auth.module';
import { UploadController } from './upload.controller';
import { UploadResolver } from './upload.resolver';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Upload', schema: UploadSchema }]),
    AuthModule,
  ],
  controllers: [UploadController],
  providers: [UploadResolver, UploadService],
  exports: [UploadService],
})
export class UploadModule {}

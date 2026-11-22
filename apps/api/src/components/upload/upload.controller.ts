import {
  ArgumentsHost,
  Body,
  Catch,
  Controller,
  ExceptionFilter,
  HttpException,
  Logger,
  PayloadTooLargeException,
  Post,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { MAX_UPLOAD_BYTES } from '../../libs/config';
import { UploadResult } from '../../libs/dto/upload/upload';
import { Message } from '../../libs/enums/common.enum';
import { UserRole } from '../../libs/enums/user.enum';
import type { AuthRequest } from '../../libs/types/auth';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UploadService } from './upload.service';

/** Same error shape as GraphQL: { message }. Too big files get a clear text. */
@Catch(HttpException)
class UploadErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger('Upload');

  public catch(exception: HttpException, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();
    const message =
      exception instanceof PayloadTooLargeException
        ? Message.FILE_TOO_LARGE
        : exception.message;

    this.logger.error(`✖ upload [${status}] ${message}`);
    res.status(status).json({ statusCode: status, message });
  }
}

@Controller('upload')
@UseFilters(UploadErrorFilter)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Admin: POST /upload (multipart/form-data)
   * fields: file = the file, folder = profile | projects | articles | ...
   */
  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
    }),
  )
  public async upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body('folder') folder: string,
    @Req() req: AuthRequest,
  ): Promise<UploadResult> {
    return await this.uploadService.uploadFile(
      file,
      folder,
      req.authUser?._id ?? '',
    );
  }
}

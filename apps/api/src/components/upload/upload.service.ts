import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import sharp from 'sharp';
import { Upload, UploadResult, Uploads } from '../../libs/dto/upload/upload';
import { UploadsInquiry } from '../../libs/dto/upload/upload.input';
import { Message } from '../../libs/enums/common.enum';
import { UploadFolder } from '../../libs/enums/upload.enum';

/** Images wider than this are scaled down. */
const MAX_IMAGE_WIDTH = 2400;
const IMAGE_FORMATS = ['jpeg', 'png', 'webp', 'avif', 'heif', 'gif', 'tiff'];

interface ProcessedFile {
  buffer: Buffer;
  extension: string;
  mimeType: string;
  width?: number;
  height?: number;
  blurDataUrl?: string;
}

/** Stored upload: public fields + who uploaded it. */
type UploadDoc = Upload & { uploadedBy?: string };

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadDir: string;
  private readonly publicUrl: string;

  constructor(
    @InjectModel('Upload') private readonly uploadModel: Model<UploadDoc>,
    config: ConfigService,
  ) {
    this.uploadDir = resolve(config.getOrThrow<string>('UPLOAD_DIR'));
    this.publicUrl = `${config.getOrThrow<string>('APP_URL')}/uploads`;
  }

  /** Saves an image (→ WebP, max 2400px) or a PDF (resume). */
  public async uploadFile(
    file: Express.Multer.File | undefined,
    folder: string,
    userId: string,
  ): Promise<UploadResult> {
    // 1. check the input
    if (!file) throw new BadRequestException(Message.UPLOAD_FAILED);
    if (!Object.values(UploadFolder).includes(folder as UploadFolder)) {
      throw new BadRequestException(Message.BAD_REQUEST);
    }

    // 2. read the real file content (the browser's file type is not trusted)
    const processed = await this.process(file.buffer);

    // 3. write to disk: <folder>/<year>/<month>/<random id>.<ext>
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const path = `${folder}/${now.getFullYear()}/${month}/${randomUUID()}.${processed.extension}`;
    const fullPath = this.toFullPath(path);

    try {
      await mkdir(dirname(fullPath), { recursive: true });
      await writeFile(fullPath, processed.buffer);
    } catch (err) {
      this.logger.error(`write ${path}: ${(err as Error).message}`);
      throw new BadRequestException(Message.UPLOAD_FAILED);
    }

    // 4. save the info
    const result = await this.uploadModel.create({
      folder: folder as UploadFolder,
      path,
      url: `${this.publicUrl}/${path}`,
      originalName: file.originalname.slice(0, 200),
      mimeType: processed.mimeType,
      size: processed.buffer.length,
      width: processed.width,
      height: processed.height,
      blurDataUrl: processed.blurDataUrl,
      uploadedBy: userId,
    });

    return { message: Message.UPLOAD_SUCCESS, data: result.toObject() };
  }

  /*** ADMIN ***/

  /** Media library, newest first. */
  public async getUploadsByAdmin(input: UploadsInquiry): Promise<Uploads> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 30;
    const match = input.folder ? { folder: input.folder } : {};

    const [result] = await this.uploadModel
      .aggregate<Uploads>([
        { $match: match },
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            list: [{ $skip: (page - 1) * limit }, { $limit: limit }],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    return result ?? { list: [], metaCounter: [] };
  }

  /** Deletes the file from disk and its info. */
  public async removeUploadByAdmin(uploadId: string): Promise<UploadResult> {
    if (!isValidObjectId(uploadId)) {
      throw new BadRequestException(Message.BAD_REQUEST);
    }

    const result = await this.uploadModel
      .findByIdAndDelete(uploadId)
      .lean()
      .exec();
    if (!result) throw new NotFoundException(Message.NO_DATA_FOUND);

    try {
      await unlink(this.toFullPath(result.path));
    } catch (err) {
      // already gone from disk: nothing to do
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        this.logger.error(`unlink ${result.path}: ${(err as Error).message}`);
      }
    }

    return { message: Message.REMOVE_SUCCESS, data: result };
  }

  /*** HELPERS ***/

  private async process(buffer: Buffer): Promise<ProcessedFile> {
    // PDF (resume): kept as it is
    if (buffer.subarray(0, 5).toString('latin1') === '%PDF-') {
      return { buffer, extension: 'pdf', mimeType: 'application/pdf' };
    }

    // image: check it really is one
    let format: string | undefined;
    try {
      format = (await sharp(buffer).metadata()).format;
    } catch {
      format = undefined;
    }
    if (!format || !IMAGE_FORMATS.includes(format)) {
      throw new BadRequestException(Message.PROVIDE_ALLOWED_FORMAT);
    }

    try {
      // turn by camera rotation, shrink if huge, convert to WebP
      const { data, info } = await sharp(buffer)
        .rotate()
        .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer({ resolveWithObject: true });

      const blur = await sharp(data)
        .resize(16)
        .webp({ quality: 40 })
        .toBuffer();

      return {
        buffer: data,
        extension: 'webp',
        mimeType: 'image/webp',
        width: info.width,
        height: info.height,
        blurDataUrl: `data:image/webp;base64,${blur.toString('base64')}`,
      };
    } catch (err) {
      this.logger.error(`process image: ${(err as Error).message}`);
      throw new BadRequestException(Message.UPLOAD_FAILED);
    }
  }

  /** Absolute path inside the uploads folder (never outside it). */
  private toFullPath(path: string): string {
    const fullPath = resolve(join(this.uploadDir, path));
    if (!fullPath.startsWith(this.uploadDir + sep)) {
      throw new BadRequestException(Message.BAD_REQUEST);
    }
    return fullPath;
  }
}

import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UploadResult, Uploads } from '../../libs/dto/upload/upload';
import { UploadsInquiry } from '../../libs/dto/upload/upload.input';
import { UserRole } from '../../libs/enums/user.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UploadService } from './upload.service';

/** Uploading itself is POST /upload (upload.controller.ts). */
@Resolver()
export class UploadResolver {
  constructor(private readonly uploadService: UploadService) {}

  /*** ADMIN ***/

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => Uploads)
  public async getUploadsByAdmin(
    @Args('input', { nullable: true }) input?: UploadsInquiry,
  ): Promise<Uploads> {
    return await this.uploadService.getUploadsByAdmin(input ?? {});
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => UploadResult)
  public async removeUploadByAdmin(
    @Args('uploadId') uploadId: string,
  ): Promise<UploadResult> {
    return await this.uploadService.removeUploadByAdmin(uploadId);
  }
}

import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { UploadFolder } from '../../enums/upload.enum';

/** Admin media library: filter by folder, paging. */
@InputType()
export class UploadsInquiry {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Field(() => Int, { nullable: true, defaultValue: 30 })
  limit?: number;

  @IsOptional()
  @IsEnum(UploadFolder)
  @Field(() => UploadFolder, { nullable: true })
  folder?: UploadFolder;
}

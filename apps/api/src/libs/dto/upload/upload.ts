import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { Types } from 'mongoose';
import { UploadFolder } from '../../enums/upload.enum';
import { TotalCounter } from '../common/common';

@ObjectType()
export class Upload {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field(() => UploadFolder)
  folder: UploadFolder;

  /** inside the uploads folder, e.g. projects/2026/11/<id>.webp **/
  @Field(() => String)
  path: string;

  /** public link: put it into a Media { url } field **/
  @Field(() => String)
  url: string;

  @Field(() => String)
  originalName: string;

  @Field(() => String)
  mimeType: string;

  /** bytes **/
  @Field(() => Int)
  size: number;

  @Field(() => Int, { nullable: true })
  width?: number;

  @Field(() => Int, { nullable: true })
  height?: number;

  /** tiny blurred preview for images **/
  @Field(() => String, { nullable: true })
  blurDataUrl?: string;

  @Field(() => Date)
  createdAt: Date;
}

@ObjectType()
export class Uploads {
  @Field(() => [Upload])
  list: Upload[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}

@ObjectType()
export class UploadResult {
  @Field(() => String)
  message: string;

  @Field(() => Upload)
  data: Upload;
}

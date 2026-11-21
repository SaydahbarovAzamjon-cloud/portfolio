import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './User.model';

/** Metadata for a file saved on the VPS disk and served by Nginx under /uploads. */
@Schema({ collection: 'uploads', timestamps: true })
export class Upload {
  /** Relative path inside the uploads directory, e.g. projects/2026/11/<uuid>.webp */
  @Prop({ required: true, unique: true })
  path: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  mimeType: string;

  /** Bytes. */
  @Prop({ required: true, min: 0 })
  size: number;

  @Prop({ min: 0 })
  width?: number;

  @Prop({ min: 0 })
  height?: number;

  @Prop({ type: Types.ObjectId, ref: User.name })
  uploadedBy?: Types.ObjectId;
}

export type UploadDocument = HydratedDocument<Upload>;
export const UploadSchema = SchemaFactory.createForClass(Upload);

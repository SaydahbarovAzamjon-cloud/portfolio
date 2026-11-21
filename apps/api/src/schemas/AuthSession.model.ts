import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './User.model';

/** One refresh-token session. The raw token lives only in an httpOnly cookie. */
@Schema({ collection: 'auth_sessions', timestamps: true })
export class AuthSession {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  user: Types.ObjectId;

  @Prop({ required: true, select: false })
  refreshTokenHash: string;

  @Prop()
  userAgent?: string;

  @Prop()
  ipHash?: string;

  /** TTL index: MongoDB removes the session once it expires. */
  @Prop({ required: true, expires: 0 })
  expiresAt: Date;

  @Prop()
  revokedAt?: Date;
}

export type AuthSessionDocument = HydratedDocument<AuthSession>;
export const AuthSessionSchema = SchemaFactory.createForClass(AuthSession);

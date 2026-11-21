import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DeviceType } from '../libs/enums/analytics.enum';

@Schema({ _id: false })
export class DeviceInfo {
  @Prop()
  browser?: string;

  @Prop()
  os?: string;

  @Prop({
    type: String,
    enum: Object.values(DeviceType),
    default: DeviceType.UNKNOWN,
  })
  type: DeviceType;
}
const DeviceInfoSchema = SchemaFactory.createForClass(DeviceInfo);

/**
 * An anonymous visitor identified by a random id in a first-party cookie.
 * Raw IP addresses are never stored.
 */
@Schema({ collection: 'visitors', timestamps: true })
export class Visitor {
  @Prop({ required: true, unique: true })
  visitorId: string;

  @Prop({ required: true, default: () => new Date() })
  firstSeenAt: Date;

  @Prop({ required: true, default: () => new Date(), index: true })
  lastSeenAt: Date;

  @Prop({ default: 1, min: 1 })
  visitCount: number;

  @Prop()
  firstReferrer?: string;

  @Prop()
  locale?: string;

  @Prop({ type: DeviceInfoSchema, default: () => ({}) })
  device: DeviceInfo;

  /** ISO country code, optional. */
  @Prop({ uppercase: true, minlength: 2, maxlength: 2 })
  country?: string;
}

export type VisitorDocument = HydratedDocument<Visitor>;
export const VisitorSchema = SchemaFactory.createForClass(Visitor);

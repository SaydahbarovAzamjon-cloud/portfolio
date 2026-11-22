import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsMongoId } from 'class-validator';
import { ContactMessageStatus } from '../../enums/contact.enum';

/** Mark as read / replied / archived / spam. */
@InputType()
export class ContactStatusUpdate {
  @IsMongoId()
  @Field(() => String)
  _id: string;

  @IsEnum(ContactMessageStatus)
  @Field(() => ContactMessageStatus)
  status: ContactMessageStatus;
}

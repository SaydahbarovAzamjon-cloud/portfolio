import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Locale } from '../../enums/common.enum';
import { ContactMessageStatus } from '../../enums/contact.enum';

/** "Get In Touch" form. */
@InputType()
export class ContactInput {
  @IsNotEmpty()
  @Length(1, 100)
  @Field(() => String)
  name: string;

  @IsEmail()
  @MaxLength(254)
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @Length(1, 150)
  @Field(() => String)
  subject: string;

  @IsNotEmpty()
  @Length(10, 5000)
  @Field(() => String)
  message: string;

  /** site language the visitor used **/
  @IsOptional()
  @IsEnum(Locale)
  @Field(() => Locale, { nullable: true })
  locale?: Locale;

  /**
   * Anti-spam trap: a hidden field real people never fill.
   * The frontend keeps it empty and invisible; bots fill it.
   */
  @IsOptional()
  @MaxLength(200)
  @Field(() => String, { nullable: true })
  website?: string;
}

/** Admin inbox: filter by status, paging. */
@InputType()
export class ContactMessagesInquiry {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Field(() => Int, { nullable: true, defaultValue: 20 })
  limit?: number;

  @IsOptional()
  @IsEnum(ContactMessageStatus)
  @Field(() => ContactMessageStatus, { nullable: true })
  status?: ContactMessageStatus;
}

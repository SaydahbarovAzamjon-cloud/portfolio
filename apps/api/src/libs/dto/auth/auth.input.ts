import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

@InputType()
export class LoginInput {
  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @Length(8, 128)
  @Field(() => String)
  password: string;
}

/** Admin settings: change password. */
@InputType()
export class ChangePasswordInput {
  @IsNotEmpty()
  @Length(8, 128)
  @Field(() => String)
  currentPassword: string;

  /** at least 12 characters **/
  @IsNotEmpty()
  @Length(12, 128)
  @Field(() => String)
  newPassword: string;

  /** 6-digit code from the email (requestPasswordCodeByAdmin) **/
  @Matches(/^\d{6}$/, { message: 'code must be 6 digits' })
  @Field(() => String)
  code: string;
}

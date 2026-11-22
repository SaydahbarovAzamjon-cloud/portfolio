import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

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

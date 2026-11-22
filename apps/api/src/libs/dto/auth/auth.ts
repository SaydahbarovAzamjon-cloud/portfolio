import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from '../../enums/user.enum';

@ObjectType()
export class Admin {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  email: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => Date, { nullable: true })
  lastLoginAt?: Date;
}

/** Returned by login / refreshToken. Tokens themselves are set as httpOnly cookies. */
@ObjectType()
export class AuthPayload {
  @Field(() => String)
  message: string;

  @Field(() => Admin)
  admin: Admin;

  /** When the access token expires; the client should call refreshToken before this. */
  @Field(() => Date)
  accessTokenExpiresAt: Date;
}

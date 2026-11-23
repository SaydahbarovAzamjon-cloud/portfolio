import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Admin, AuthPayload, MessageResult } from '../../libs/dto/auth/auth';
import {
  ChangePasswordInput,
  LoginInput,
} from '../../libs/dto/auth/auth.input';
import { UserRole } from '../../libs/enums/user.enum';
import type { GqlContext } from '../../libs/types/auth';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GqlThrottlerGuard } from '../auth/guards/throttler.guard';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GqlThrottlerGuard)
  @Mutation(() => AuthPayload)
  public async login(
    @Args('input') input: LoginInput,
    @Context() { req, res }: GqlContext,
  ): Promise<AuthPayload> {
    return await this.userService.login(input, req, res);
  }

  @UseGuards(GqlThrottlerGuard)
  @Mutation(() => AuthPayload)
  public async refreshToken(
    @Context() { req, res }: GqlContext,
  ): Promise<AuthPayload> {
    return await this.userService.refreshToken(req, res);
  }

  @Mutation(() => Boolean)
  public async logout(@Context() { req, res }: GqlContext): Promise<boolean> {
    return await this.userService.logout(req, res);
  }

  @UseGuards(AuthGuard)
  @Query(() => Admin)
  public async me(@AuthMember('_id') userId: string): Promise<Admin> {
    return await this.userService.getAdmin(userId);
  }

  /*** ADMIN ***/

  /** Admin settings, step 1: email a 6-digit code to the owner (rate limited). */
  @Roles(UserRole.ADMIN)
  @UseGuards(GqlThrottlerGuard, RolesGuard)
  @Mutation(() => MessageResult)
  public async requestPasswordCodeByAdmin(
    @AuthMember('_id') userId: string,
  ): Promise<MessageResult> {
    return await this.userService.requestPasswordCodeByAdmin(userId);
  }

  /** Admin settings, step 2: change password with the code (rate limited). */
  @Roles(UserRole.ADMIN)
  @UseGuards(GqlThrottlerGuard, RolesGuard)
  @Mutation(() => MessageResult)
  public async changePasswordByAdmin(
    @Args('input') input: ChangePasswordInput,
    @AuthMember('_id') userId: string,
    @AuthMember('sessionId') sessionId: string,
  ): Promise<MessageResult> {
    return await this.userService.changePasswordByAdmin(
      userId,
      sessionId,
      input,
    );
  }
}

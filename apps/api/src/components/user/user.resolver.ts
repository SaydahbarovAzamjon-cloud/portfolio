import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Admin, AuthPayload } from '../../libs/dto/auth/auth';
import { LoginInput } from '../../libs/dto/auth/auth.input';
import type { GqlContext } from '../../libs/types/auth';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
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
}

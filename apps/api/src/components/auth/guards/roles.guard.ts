import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Message } from '../../../libs/enums/common.enum';
import { UserRole } from '../../../libs/enums/user.enum';
import type { AuthRequest, GqlContext } from '../../../libs/types/auth';
import { AuthService } from '../auth.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Login required AND the user must have one of the @Roles(...).
 * Works for GraphQL resolvers and plain HTTP controllers (file upload).
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<UserRole[] | undefined>(
      ROLES_KEY,
      context.getHandler(),
    );
    const req =
      context.getType<GqlContextType>() === 'graphql'
        ? GqlExecutionContext.create(context).getContext<GqlContext>().req
        : context.switchToHttp().getRequest<AuthRequest>();

    const authUser = await this.authService.authenticate(req);
    if (!authUser) throw new UnauthorizedException(Message.NOT_AUTHENTICATED);
    if (roles?.length && !roles.includes(authUser.role)) {
      throw new ForbiddenException(Message.ONLY_SPECIFIC_ROLES_ALLOWED);
    }

    req.authUser = authUser;
    return true;
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Message } from '../../../libs/enums/common.enum';
import type { GqlContext } from '../../../libs/types/auth';
import { AuthService } from '../auth.service';

/** Login required. */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const { req } =
      GqlExecutionContext.create(context).getContext<GqlContext>();

    const authUser = await this.authService.authenticate(req);
    if (!authUser) throw new UnauthorizedException(Message.NOT_AUTHENTICATED);

    req.authUser = authUser;
    return true;
  }
}

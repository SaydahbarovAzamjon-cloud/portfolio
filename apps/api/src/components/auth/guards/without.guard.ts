import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { GqlContext } from '../../../libs/types/auth';
import { AuthService } from '../auth.service';

/** Login optional: attaches the user when logged in, otherwise null. Never blocks. */
@Injectable()
export class WithoutGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const { req } =
      GqlExecutionContext.create(context).getContext<GqlContext>();
    req.authUser = await this.authService.authenticate(req);
    return true;
  }
}

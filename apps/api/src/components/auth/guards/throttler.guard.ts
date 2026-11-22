import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { GqlContext } from '../../../libs/types/auth';

/** Rate limiting for GraphQL resolvers (limits come from ThrottlerModule in app.module). */
@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  protected getRequestResponse(context: ExecutionContext) {
    const { req, res } =
      GqlExecutionContext.create(context).getContext<GqlContext>();
    return { req, res };
  }
}

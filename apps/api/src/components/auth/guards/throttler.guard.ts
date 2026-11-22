import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';
import { Message } from '../../../libs/enums/common.enum';
import type { GqlContext } from '../../../libs/types/auth';

/** Rate limiting for GraphQL resolvers (limits come from ThrottlerModule in app.module). */
@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  protected getRequestResponse(context: ExecutionContext) {
    const { req, res } =
      GqlExecutionContext.create(context).getContext<GqlContext>();
    return { req, res };
  }

  /** Same friendly text as every other error. */
  protected throwThrottlingException(): Promise<void> {
    throw new ThrottlerException(Message.TOO_MANY_ATTEMPTS);
  }
}

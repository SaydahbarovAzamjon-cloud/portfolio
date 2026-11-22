import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { AuthUser, GqlContext } from '../../../libs/types/auth';

/**
 * Injects the logged-in user (set by AuthGuard / RolesGuard / WithoutGuard).
 * @AuthMember() → whole user, @AuthMember('_id') → one field. Null when not logged in.
 */
export const AuthMember = createParamDecorator(
  (field: keyof AuthUser | undefined, context: ExecutionContext) => {
    const { req } =
      GqlExecutionContext.create(context).getContext<GqlContext>();
    const user = req.authUser ?? null;
    if (!user) return null;
    return field ? user[field] : user;
  },
);

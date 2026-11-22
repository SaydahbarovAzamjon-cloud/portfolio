import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';
import type { GqlContext } from '../types/auth';

/** Hides passwords and tokens before anything is printed. */
export const maskSecrets = (text: string): string =>
  text.replace(/("?(?:password|token|secret)\w*"?\s*:\s*)"[^"]*"/gi, '$1"***"');

/**
 * Development only: prints every GraphQL request (green) and its response time.
 * Errors are printed in red by formatGraphQLError (graphql/format-error.ts).
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('GraphQL');

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    if (context.getType<GqlContextType>() !== 'graphql') return next.handle();

    const startedAt = Date.now();
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo<{ operation: { operation: string } }>();
    const name = `${info.operation.operation} ${gqlContext.getHandler().name}`;
    const { req } = gqlContext.getContext<GqlContext>();
    const variables = (req.body as { variables?: unknown })?.variables;

    this.logger.log(
      `→ ${name}${variables ? ' ' + maskSecrets(JSON.stringify(variables)) : ''}`,
    );

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`✔ ${name} - ${Date.now() - startedAt}ms`);
      }),
    );
  }
}

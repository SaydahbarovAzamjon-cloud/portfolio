import { join } from 'node:path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import type { GqlContext } from '../libs/types/auth';
import { formatGraphQLError } from './format-error';

@Module({
  imports: [
    NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService): ApolloDriverConfig => {
        const isProduction = config.get<string>('NODE_ENV') === 'production';
        return {
          // Code-first: the schema is generated from TypeScript classes.
          // In development it is also written to disk so the frontend can use it later.
          autoSchemaFile: isProduction
            ? true
            : join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          playground: false,
          graphiql: !isProduction,
          introspection: !isProduction,
          includeStacktraceInErrorResponses: !isProduction,
          formatError: (formatted, error) =>
            formatGraphQLError(formatted, error, isProduction),
          context: ({ req, res }: GqlContext): GqlContext => ({
            req,
            res,
          }),
        };
      },
    }),
  ],
})
export class GraphQLModule {}

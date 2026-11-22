import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';
import { GraphQLModule } from './graphql/graphql.module';
import { envValidationSchema } from './libs/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envValidationSchema,
    }),
    // Limits used by GqlThrottlerGuard (login, refresh; later contact & comments).
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.getOrThrow<number>('LOGIN_RATE_TTL_SECONDS') * 1000,
          limit: config.getOrThrow<number>('LOGIN_RATE_LIMIT'),
        },
      ],
    }),
    DatabaseModule,
    GraphQLModule,
    ComponentsModule,
  ],
})
export class AppModule {}

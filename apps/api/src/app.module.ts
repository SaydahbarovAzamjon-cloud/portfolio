import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    DatabaseModule,
    GraphQLModule,
    ComponentsModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI'),
        // Create indexes on startup in every environment (unique slugs, one like per
        // visitor, 24h view TTL, text search, session expiry). Data is small, so it is cheap.
        autoIndex: true,
      }),
    }),
  ],
})
export class DatabaseModule {}

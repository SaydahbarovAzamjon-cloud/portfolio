import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from '../components/user/user.module';
import { UserService } from '../components/user/user.service';
import { DatabaseModule } from '../database/database.module';
import { envValidationSchema } from '../libs/env.validation';

/**
 * Creates the single admin account (or resets its password).
 * Usage: set ADMIN_EMAIL and ADMIN_PASSWORD in .env, then run `pnpm seed:admin`.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    // UserModule's resolver uses the rate-limit guard, so its config must exist.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 5 }]),
    DatabaseModule,
    UserModule,
  ],
})
class SeedModule {}

async function seedAdmin(): Promise<void> {
  const logger = new Logger('SeedAdmin');
  const app = await NestFactory.createApplicationContext(SeedModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const config = app.get(ConfigService);
    const email = config.get<string>('ADMIN_EMAIL');
    const password = config.get<string>('ADMIN_PASSWORD');

    if (!email || !password) {
      throw new Error(
        'Set ADMIN_EMAIL and ADMIN_PASSWORD (min 12 characters) in apps/api/.env first.',
      );
    }

    const result = await app.get(UserService).upsertAdmin(email, password);

    logger.log(
      result === 'created'
        ? `Admin account created: ${email}`
        : `Admin password updated: ${email}`,
    );
    logger.log('You can now remove ADMIN_PASSWORD from .env.');
  } catch (err) {
    logger.error((err as Error).message);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

void seedAdmin();

import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';

/** Collects every business component in one place. */
@Module({
  imports: [HealthModule, UserModule, AuthModule],
})
export class ComponentsModule {}

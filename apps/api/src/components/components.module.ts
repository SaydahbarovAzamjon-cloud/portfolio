import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';

/** Collects every business component in one place (nestar style). */
@Module({
  imports: [HealthModule],
})
export class ComponentsModule {}

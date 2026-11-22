import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EducationModule } from './education/education.module';
import { HealthModule } from './health/health.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';

/** Collects every business component in one place. */
@Module({
  imports: [
    HealthModule,
    AuthModule,
    UserModule,
    ProfileModule,
    EducationModule,
  ],
})
export class ComponentsModule {}

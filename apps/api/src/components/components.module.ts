import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EducationModule } from './education/education.module';
import { ExperienceModule } from './experience/experience.module';
import { HealthModule } from './health/health.module';
import { ProfileModule } from './profile/profile.module';
import { ProjectModule } from './project/project.module';
import { SkillModule } from './skill/skill.module';
import { UserModule } from './user/user.module';

/** Collects every business component in one place. */
@Module({
  imports: [
    HealthModule,
    AuthModule,
    UserModule,
    ProfileModule,
    EducationModule,
    SkillModule,
    ExperienceModule,
    ProjectModule,
  ],
})
export class ComponentsModule {}

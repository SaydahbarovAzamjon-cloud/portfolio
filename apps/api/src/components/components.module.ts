import { Module } from '@nestjs/common';
import { AnalyticsModule } from './analytics/analytics.module';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { ContactModule } from './contact/contact.module';
import { EducationModule } from './education/education.module';
import { ExperienceModule } from './experience/experience.module';
import { HealthModule } from './health/health.module';
import { ProfileModule } from './profile/profile.module';
import { ProjectModule } from './project/project.module';
import { SkillModule } from './skill/skill.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { VisitorModule } from './visitor/visitor.module';

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
    ArticleModule,
    CommentModule,
    ContactModule,
    VisitorModule,
    AnalyticsModule,
    UploadModule,
  ],
})
export class ComponentsModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ExperienceSchema from '../../schemas/Experience.model';
import ProjectSchema from '../../schemas/Project.model';
import { AuthModule } from '../auth/auth.module';
import { SkillModule } from '../skill/skill.module';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Project', schema: ProjectSchema },
      { name: 'Experience', schema: ExperienceSchema },
    ]),
    AuthModule,
    SkillModule,
  ],
  providers: [ProjectResolver, ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}

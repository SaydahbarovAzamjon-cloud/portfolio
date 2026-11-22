import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ExperienceSchema from '../../schemas/Experience.model';
import SkillSchema from '../../schemas/Skill.model';
import { AuthModule } from '../auth/auth.module';
import { ExperienceResolver } from './experience.resolver';
import { ExperienceService } from './experience.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Experience', schema: ExperienceSchema },
      { name: 'Skill', schema: SkillSchema },
    ]),
    AuthModule,
  ],
  providers: [ExperienceResolver, ExperienceService],
  exports: [ExperienceService],
})
export class ExperienceModule {}

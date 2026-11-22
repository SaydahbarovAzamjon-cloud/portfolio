import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ExperienceSchema from '../../schemas/Experience.model';
import { AuthModule } from '../auth/auth.module';
import { SkillModule } from '../skill/skill.module';
import { ExperienceResolver } from './experience.resolver';
import { ExperienceService } from './experience.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Experience', schema: ExperienceSchema },
    ]),
    AuthModule,
    SkillModule,
  ],
  providers: [ExperienceResolver, ExperienceService],
  exports: [ExperienceService],
})
export class ExperienceModule {}

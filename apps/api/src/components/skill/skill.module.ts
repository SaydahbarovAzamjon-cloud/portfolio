import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import SkillSchema from '../../schemas/Skill.model';
import SkillCategorySchema from '../../schemas/SkillCategory.model';
import { AuthModule } from '../auth/auth.module';
import { SkillResolver } from './skill.resolver';
import { SkillService } from './skill.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Skill', schema: SkillSchema },
      { name: 'SkillCategory', schema: SkillCategorySchema },
    ]),
    AuthModule,
  ],
  providers: [SkillResolver, SkillService],
  exports: [SkillService],
})
export class SkillModule {}

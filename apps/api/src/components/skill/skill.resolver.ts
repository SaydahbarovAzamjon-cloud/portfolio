import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  SkillCategory,
  SkillCategoryResult,
  SkillResult,
} from '../../libs/dto/skill/skill';
import {
  SkillCategoryInput,
  SkillInput,
} from '../../libs/dto/skill/skill.input';
import {
  SkillCategoryUpdate,
  SkillUpdate,
} from '../../libs/dto/skill/skill.update';
import { UserRole } from '../../libs/enums/user.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SkillService } from './skill.service';

@Resolver()
export class SkillResolver {
  constructor(private readonly skillService: SkillService) {}

  /** Public: categories (in order), each with its skills. */
  @Query(() => [SkillCategory])
  public async getSkills(): Promise<SkillCategory[]> {
    return await this.skillService.getSkills();
  }

  /*** ADMIN: CATEGORIES ***/

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => SkillCategoryResult)
  public async createSkillCategoryByAdmin(
    @Args('input') input: SkillCategoryInput,
  ): Promise<SkillCategoryResult> {
    return await this.skillService.createSkillCategoryByAdmin(input);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => SkillCategoryResult)
  public async updateSkillCategoryByAdmin(
    @Args('input') input: SkillCategoryUpdate,
  ): Promise<SkillCategoryResult> {
    return await this.skillService.updateSkillCategoryByAdmin(input);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => SkillCategoryResult)
  public async removeSkillCategoryByAdmin(
    @Args('categoryId') categoryId: string,
  ): Promise<SkillCategoryResult> {
    return await this.skillService.removeSkillCategoryByAdmin(categoryId);
  }

  /*** ADMIN: SKILLS ***/

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => SkillResult)
  public async createSkillByAdmin(
    @Args('input') input: SkillInput,
  ): Promise<SkillResult> {
    return await this.skillService.createSkillByAdmin(input);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => SkillResult)
  public async updateSkillByAdmin(
    @Args('input') input: SkillUpdate,
  ): Promise<SkillResult> {
    return await this.skillService.updateSkillByAdmin(input);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => SkillResult)
  public async removeSkillByAdmin(
    @Args('skillId') skillId: string,
  ): Promise<SkillResult> {
    return await this.skillService.removeSkillByAdmin(skillId);
  }
}

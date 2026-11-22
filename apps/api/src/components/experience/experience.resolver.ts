import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  Experience,
  ExperienceResult,
} from '../../libs/dto/experience/experience';
import { ExperienceInput } from '../../libs/dto/experience/experience.input';
import { ExperienceUpdate } from '../../libs/dto/experience/experience.update';
import { UserRole } from '../../libs/enums/user.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ExperienceService } from './experience.service';

@Resolver()
export class ExperienceResolver {
  constructor(private readonly experienceService: ExperienceService) {}

  /** Public: jobs (newest first), each with its skills. */
  @Query(() => [Experience])
  public async getExperiences(): Promise<Experience[]> {
    return await this.experienceService.getExperiences();
  }

  /*** ADMIN ***/

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => ExperienceResult)
  public async createExperienceByAdmin(
    @Args('input') input: ExperienceInput,
  ): Promise<ExperienceResult> {
    return await this.experienceService.createExperienceByAdmin(input);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => ExperienceResult)
  public async updateExperienceByAdmin(
    @Args('input') input: ExperienceUpdate,
  ): Promise<ExperienceResult> {
    return await this.experienceService.updateExperienceByAdmin(input);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => ExperienceResult)
  public async removeExperienceByAdmin(
    @Args('experienceId') experienceId: string,
  ): Promise<ExperienceResult> {
    return await this.experienceService.removeExperienceByAdmin(experienceId);
  }
}

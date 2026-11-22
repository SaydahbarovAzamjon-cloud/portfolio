import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Education, EducationResult } from '../../libs/dto/education/education';
import { EducationInput } from '../../libs/dto/education/education.input';
import { EducationUpdate } from '../../libs/dto/education/education.update';
import { UserRole } from '../../libs/enums/user.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { EducationService } from './education.service';

@Resolver()
export class EducationResolver {
  constructor(private readonly educationService: EducationService) {}

  /** Public: About page "Education" section. */
  @Query(() => [Education])
  public async getEducations(): Promise<Education[]> {
    return await this.educationService.getEducations();
  }

  /*** ADMIN ***/

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => EducationResult)
  public async createEducationByAdmin(
    @Args('input') input: EducationInput,
  ): Promise<EducationResult> {
    return await this.educationService.createEducationByAdmin(input);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => EducationResult)
  public async updateEducationByAdmin(
    @Args('input') input: EducationUpdate,
  ): Promise<EducationResult> {
    return await this.educationService.updateEducationByAdmin(input);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => EducationResult)
  public async removeEducationByAdmin(
    @Args('educationId') educationId: string,
  ): Promise<EducationResult> {
    return await this.educationService.removeEducationByAdmin(educationId);
  }
}

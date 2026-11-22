import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Project, ProjectResult } from '../../libs/dto/project/project';
import {
  ProjectInput,
  ProjectsInquiry,
} from '../../libs/dto/project/project.input';
import { ProjectUpdate } from '../../libs/dto/project/project.update';
import { UserRole } from '../../libs/enums/user.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProjectService } from './project.service';

@Resolver()
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  /** Public: published projects, optional filter (category / showOnHome). */
  @Query(() => [Project])
  public async getProjects(
    @Args('input', { nullable: true }) input?: ProjectsInquiry,
  ): Promise<Project[]> {
    return await this.projectService.getProjects(input ?? {});
  }

  /** Public: one published project by slug (case study page). */
  @Query(() => Project)
  public async getProject(@Args('slug') slug: string): Promise<Project> {
    return await this.projectService.getProject(slug);
  }

  /*** ADMIN ***/

  /** All projects, drafts included. */
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => [Project])
  public async getAllProjectsByAdmin(): Promise<Project[]> {
    return await this.projectService.getAllProjectsByAdmin();
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => ProjectResult)
  public async createProjectByAdmin(
    @Args('input') input: ProjectInput,
  ): Promise<ProjectResult> {
    return await this.projectService.createProjectByAdmin(input);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => ProjectResult)
  public async updateProjectByAdmin(
    @Args('input') input: ProjectUpdate,
  ): Promise<ProjectResult> {
    return await this.projectService.updateProjectByAdmin(input);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => ProjectResult)
  public async removeProjectByAdmin(
    @Args('projectId') projectId: string,
  ): Promise<ProjectResult> {
    return await this.projectService.removeProjectByAdmin(projectId);
  }
}

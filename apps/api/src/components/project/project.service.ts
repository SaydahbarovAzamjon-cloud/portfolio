import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, PipelineStage } from 'mongoose';
import { isDuplicateKeyError, toSlug } from '../../libs/config';
import { Experience } from '../../libs/dto/experience/experience';
import { Project, ProjectResult } from '../../libs/dto/project/project';
import {
  ProjectInput,
  ProjectsInquiry,
} from '../../libs/dto/project/project.input';
import { ProjectUpdate } from '../../libs/dto/project/project.update';
import { Message } from '../../libs/enums/common.enum';
import { SkillService } from '../skill/skill.service';

/** Adds `skills` (full skill objects) to each project. */
const lookupSkills: PipelineStage = {
  $lookup: {
    from: 'skills',
    localField: 'skillIds',
    foreignField: '_id',
    as: 'skills',
  },
};

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectModel('Project') private readonly projectModel: Model<Project>,
    @InjectModel('Experience')
    private readonly experienceModel: Model<Experience>,
    private readonly skillService: SkillService,
  ) {}

  public async getProjects(input: ProjectsInquiry): Promise<Project[]> {
    const match: Record<string, unknown> = { isPublished: true };
    if (input.category) match.category = input.category;
    if (input.showOnHome !== undefined) match.showOnHome = input.showOnHome;

    return await this.projectModel
      .aggregate<Project>([
        { $match: match },
        { $sort: { order: 1, createdAt: -1 } },
        lookupSkills,
      ])
      .exec();
  }

  public async getProject(slug: string): Promise<Project> {
    const [result] = await this.projectModel
      .aggregate<Project>([
        { $match: { slug: slug.toLowerCase(), isPublished: true } },
        lookupSkills,
      ])
      .exec();
    if (!result) throw new NotFoundException(Message.NO_DATA_FOUND);

    return result;
  }

  /*** ADMIN ***/

  public async getAllProjectsByAdmin(): Promise<Project[]> {
    return await this.projectModel
      .aggregate<Project>([
        { $sort: { order: 1, createdAt: -1 } },
        lookupSkills,
      ])
      .exec();
  }

  public async createProjectByAdmin(
    input: ProjectInput,
  ): Promise<ProjectResult> {
    // 1. check skills
    if (input.skillIds)
      await this.skillService.checkSkillsExist(input.skillIds);

    // 2. slug from the title when not given
    const slug = input.slug ?? toSlug(input.title);
    if (!slug) throw new BadRequestException(Message.BAD_REQUEST);

    // 3. save
    try {
      const result = await this.projectModel.create({ ...input, slug });
      return { message: Message.CREATE_SUCCESS, data: result };
    } catch (err) {
      throw this.handleWriteError('createProject', err, Message.CREATE_FAILED);
    }
  }

  public async updateProjectByAdmin(
    input: ProjectUpdate,
  ): Promise<ProjectResult> {
    const { _id, ...fields } = input;

    // 1. check skills
    if (fields.skillIds) {
      await this.skillService.checkSkillsExist(fields.skillIds);
    }

    // 2. save
    try {
      const result = await this.projectModel
        .findByIdAndUpdate(
          _id,
          { $set: fields },
          { new: true, runValidators: true },
        )
        .lean()
        .exec();
      if (!result) throw new NotFoundException(Message.NO_DATA_FOUND);

      return { message: Message.UPDATE_SUCCESS, data: result };
    } catch (err) {
      throw this.handleWriteError('updateProject', err, Message.UPDATE_FAILED);
    }
  }

  public async removeProjectByAdmin(projectId: string): Promise<ProjectResult> {
    if (!isValidObjectId(projectId)) {
      throw new BadRequestException(Message.BAD_REQUEST);
    }

    // 1. remove the project
    const result = await this.projectModel
      .findByIdAndDelete(projectId)
      .lean()
      .exec();
    if (!result) throw new NotFoundException(Message.NO_DATA_FOUND);

    // 2. unlink it from experiences
    await this.experienceModel
      .updateMany(
        { projectIds: projectId },
        { $pull: { projectIds: projectId } },
      )
      .exec();

    return { message: Message.REMOVE_SUCCESS, data: result };
  }

  /*** HELPERS ***/

  /** Known errors pass through; duplicate slug → 409; anything else is logged. */
  private handleWriteError(
    where: string,
    err: unknown,
    message: Message,
  ): Error {
    if (err instanceof NotFoundException) return err;
    if (isDuplicateKeyError(err)) {
      return new ConflictException(Message.ALREADY_EXISTS);
    }
    this.logger.error(`${where}: ${(err as Error).message}`);
    return new BadRequestException(message);
  }
}

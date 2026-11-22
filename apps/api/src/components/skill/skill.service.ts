import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { isDuplicateKeyError, toSlug } from '../../libs/config';
import {
  Skill,
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
import { Message } from '../../libs/enums/common.enum';

@Injectable()
export class SkillService {
  private readonly logger = new Logger(SkillService.name);

  constructor(
    @InjectModel('Skill') private readonly skillModel: Model<Skill>,
    @InjectModel('SkillCategory')
    private readonly categoryModel: Model<SkillCategory>,
  ) {}

  public async getSkills(): Promise<SkillCategory[]> {
    return await this.categoryModel
      .aggregate<SkillCategory>([
        { $sort: { order: 1, createdAt: 1 } },
        {
          $lookup: {
            from: 'skills',
            let: { categoryId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$categoryId', '$$categoryId'] } } },
              { $sort: { order: 1, name: 1 } },
            ],
            as: 'skills',
          },
        },
      ])
      .exec();
  }

  /*** ADMIN: CATEGORIES ***/

  public async createSkillCategoryByAdmin(
    input: SkillCategoryInput,
  ): Promise<SkillCategoryResult> {
    const key = input.key ?? toSlug(input.title.en);

    try {
      const result = await this.categoryModel.create({ ...input, key });
      return { message: Message.CREATE_SUCCESS, data: result };
    } catch (err) {
      throw this.handleWriteError(
        'createSkillCategory',
        err,
        Message.CREATE_FAILED,
      );
    }
  }

  public async updateSkillCategoryByAdmin(
    input: SkillCategoryUpdate,
  ): Promise<SkillCategoryResult> {
    const { _id, ...fields } = input;

    try {
      const result = await this.categoryModel
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
      throw this.handleWriteError(
        'updateSkillCategory',
        err,
        Message.UPDATE_FAILED,
      );
    }
  }

  /** Only empty categories can be removed. */
  public async removeSkillCategoryByAdmin(
    categoryId: string,
  ): Promise<SkillCategoryResult> {
    if (!isValidObjectId(categoryId)) {
      throw new BadRequestException(Message.BAD_REQUEST);
    }

    const hasSkills = await this.skillModel.exists({ categoryId }).exec();
    if (hasSkills) throw new BadRequestException(Message.CATEGORY_NOT_EMPTY);

    const result = await this.categoryModel
      .findByIdAndDelete(categoryId)
      .lean()
      .exec();
    if (!result) throw new NotFoundException(Message.NO_DATA_FOUND);

    return { message: Message.REMOVE_SUCCESS, data: result };
  }

  /*** ADMIN: SKILLS ***/

  public async createSkillByAdmin(input: SkillInput): Promise<SkillResult> {
    await this.checkCategoryExists(input.categoryId);
    const slug = input.slug ?? toSlug(input.name);

    try {
      const result = await this.skillModel.create({ ...input, slug });
      return { message: Message.CREATE_SUCCESS, data: result };
    } catch (err) {
      throw this.handleWriteError('createSkill', err, Message.CREATE_FAILED);
    }
  }

  public async updateSkillByAdmin(input: SkillUpdate): Promise<SkillResult> {
    const { _id, ...fields } = input;
    if (fields.categoryId) await this.checkCategoryExists(fields.categoryId);

    try {
      const result = await this.skillModel
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
      throw this.handleWriteError('updateSkill', err, Message.UPDATE_FAILED);
    }
  }

  public async removeSkillByAdmin(skillId: string): Promise<SkillResult> {
    if (!isValidObjectId(skillId)) {
      throw new BadRequestException(Message.BAD_REQUEST);
    }

    const result = await this.skillModel
      .findByIdAndDelete(skillId)
      .lean()
      .exec();
    if (!result) throw new NotFoundException(Message.NO_DATA_FOUND);

    return { message: Message.REMOVE_SUCCESS, data: result };
  }

  /*** HELPERS ***/

  private async checkCategoryExists(categoryId: string): Promise<void> {
    const exists = await this.categoryModel.exists({ _id: categoryId }).exec();
    if (!exists) throw new NotFoundException(Message.NO_DATA_FOUND);
  }

  /** Known errors pass through; duplicates → 409; anything else is logged. */
  private handleWriteError(
    where: string,
    err: unknown,
    message: Message,
  ): Error {
    if (err instanceof NotFoundException) return err;
    if (isDuplicateKeyError(err))
      return new ConflictException(Message.ALREADY_EXISTS);
    this.logger.error(`${where}: ${(err as Error).message}`);
    return new BadRequestException(message);
  }
}

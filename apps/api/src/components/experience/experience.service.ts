import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import {
  Experience,
  ExperienceResult,
} from '../../libs/dto/experience/experience';
import { ExperienceInput } from '../../libs/dto/experience/experience.input';
import { ExperienceUpdate } from '../../libs/dto/experience/experience.update';
import { Message } from '../../libs/enums/common.enum';
import { SkillService } from '../skill/skill.service';

@Injectable()
export class ExperienceService {
  private readonly logger = new Logger(ExperienceService.name);

  constructor(
    @InjectModel('Experience')
    private readonly experienceModel: Model<Experience>,
    private readonly skillService: SkillService,
  ) {}

  public async getExperiences(): Promise<Experience[]> {
    return await this.experienceModel
      .aggregate<Experience>([
        { $sort: { order: 1, startDate: -1 } },
        {
          $lookup: {
            from: 'skills',
            localField: 'skillIds',
            foreignField: '_id',
            as: 'skills',
          },
        },
      ])
      .exec();
  }

  /*** ADMIN ***/

  public async createExperienceByAdmin(
    input: ExperienceInput,
  ): Promise<ExperienceResult> {
    // 1. check dates and skills
    this.checkDates(input.startDate, input.endDate);
    if (input.skillIds)
      await this.skillService.checkSkillsExist(input.skillIds);

    // 2. save
    try {
      const result = await this.experienceModel.create(input);
      return { message: Message.CREATE_SUCCESS, data: result };
    } catch (err) {
      this.logger.error(`createExperience: ${(err as Error).message}`);
      throw new BadRequestException(Message.CREATE_FAILED);
    }
  }

  public async updateExperienceByAdmin(
    input: ExperienceUpdate,
  ): Promise<ExperienceResult> {
    const { _id, ...fields } = input;

    // 1. check skills
    if (fields.skillIds)
      await this.skillService.checkSkillsExist(fields.skillIds);

    // 2. find the saved job
    const current = await this.experienceModel.findById(_id).lean().exec();
    if (!current) throw new NotFoundException(Message.NO_DATA_FOUND);

    // 3. check dates (new values, or the saved ones)
    const startDate = fields.startDate ?? current.startDate;
    const endDate =
      fields.endDate !== undefined ? fields.endDate : current.endDate;
    this.checkDates(startDate, endDate);

    // 4. save
    try {
      const result = await this.experienceModel
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
      if (err instanceof NotFoundException) throw err;
      this.logger.error(`updateExperience: ${(err as Error).message}`);
      throw new BadRequestException(Message.UPDATE_FAILED);
    }
  }

  public async removeExperienceByAdmin(
    experienceId: string,
  ): Promise<ExperienceResult> {
    if (!isValidObjectId(experienceId)) {
      throw new BadRequestException(Message.BAD_REQUEST);
    }

    const result = await this.experienceModel
      .findByIdAndDelete(experienceId)
      .lean()
      .exec();
    if (!result) throw new NotFoundException(Message.NO_DATA_FOUND);

    return { message: Message.REMOVE_SUCCESS, data: result };
  }

  /*** HELPERS ***/

  /** End date (if any) must not be before the start date. */
  private checkDates(startDate: Date, endDate?: Date | null): void {
    if (endDate && new Date(endDate) < new Date(startDate)) {
      throw new BadRequestException(Message.INVALID_DATE_RANGE);
    }
  }
}

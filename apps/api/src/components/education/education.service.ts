import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Education, EducationResult } from '../../libs/dto/education/education';
import { EducationInput } from '../../libs/dto/education/education.input';
import { EducationUpdate } from '../../libs/dto/education/education.update';
import { Message } from '../../libs/enums/common.enum';

@Injectable()
export class EducationService {
  private readonly logger = new Logger(EducationService.name);

  constructor(
    @InjectModel('Education') private readonly educationModel: Model<Education>,
  ) {}

  public async getEducations(): Promise<Education[]> {
    return await this.educationModel
      .find()
      .sort({ order: 1, startDate: -1 })
      .lean()
      .exec();
  }

  /*** ADMIN ***/

  public async createEducationByAdmin(
    input: EducationInput,
  ): Promise<EducationResult> {
    try {
      const result = await this.educationModel.create(input);
      return { message: Message.CREATE_SUCCESS, data: result };
    } catch (err) {
      this.logger.error(`createEducation: ${(err as Error).message}`);
      throw new BadRequestException(Message.CREATE_FAILED);
    }
  }

  public async updateEducationByAdmin(
    input: EducationUpdate,
  ): Promise<EducationResult> {
    const { _id, ...fields } = input;

    try {
      const result = await this.educationModel
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
      this.logger.error(`updateEducation: ${(err as Error).message}`);
      throw new BadRequestException(Message.UPDATE_FAILED);
    }
  }

  public async removeEducationByAdmin(
    educationId: string,
  ): Promise<EducationResult> {
    if (!isValidObjectId(educationId)) {
      throw new BadRequestException(Message.BAD_REQUEST);
    }

    const result = await this.educationModel
      .findByIdAndDelete(educationId)
      .lean()
      .exec();
    if (!result) throw new NotFoundException(Message.NO_DATA_FOUND);

    return { message: Message.REMOVE_SUCCESS, data: result };
  }
}

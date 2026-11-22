import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileResult } from '../../libs/dto/profile/profile';
import { ProfileUpdate } from '../../libs/dto/profile/profile.update';
import { Message } from '../../libs/enums/common.enum';

/** The profile is a singleton: there is only one document. */
const PROFILE_KEY = { singletonKey: 'profile' };

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectModel('Profile') private readonly profileModel: Model<Profile>,
  ) {}

  public async getProfile(): Promise<Profile> {
    const profile = await this.profileModel.findOne(PROFILE_KEY).lean().exec();
    if (!profile) throw new NotFoundException(Message.NO_DATA_FOUND);
    return profile;
  }

  /*** ADMIN ***/

  public async updateProfileByAdmin(
    input: ProfileUpdate,
  ): Promise<ProfileResult> {
    const exists = await this.profileModel.exists(PROFILE_KEY).exec();

    // 1. First time: create the profile (required fields must be present)
    if (!exists) {
      const { name, fullName, headline, location, contactEmail } = input;
      if (!name || !fullName || !headline || !location || !contactEmail) {
        throw new BadRequestException(Message.PROFILE_REQUIRED_FIELDS);
      }

      try {
        const created = await this.profileModel.create(input);
        return { message: Message.CREATE_SUCCESS, data: created };
      } catch (err) {
        this.logger.error(`createProfile: ${(err as Error).message}`);
        throw new BadRequestException(Message.CREATE_FAILED);
      }
    }

    // 2. Later: update only the fields that were sent
    try {
      const updated = await this.profileModel
        .findOneAndUpdate(
          PROFILE_KEY,
          { $set: input },
          { new: true, runValidators: true },
        )
        .lean()
        .exec();
      if (!updated) throw new NotFoundException(Message.NO_DATA_FOUND);

      return { message: Message.UPDATE_SUCCESS, data: updated };
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      this.logger.error(`updateProfile: ${(err as Error).message}`);
      throw new BadRequestException(Message.UPDATE_FAILED);
    }
  }
}

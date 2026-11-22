import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Profile, ProfileResult } from '../../libs/dto/profile/profile';
import { ProfileUpdate } from '../../libs/dto/profile/profile.update';
import { UserRole } from '../../libs/enums/user.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProfileService } from './profile.service';

@Resolver()
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  /** Public: Home, About, Contact and Footer use this. */
  @Query(() => Profile)
  public async getProfile(): Promise<Profile> {
    return await this.profileService.getProfile();
  }

  /*** ADMIN ***/

  /** Creates the profile the first time, then updates only the fields sent. */
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => ProfileResult)
  public async updateProfileByAdmin(
    @Args('input') input: ProfileUpdate,
  ): Promise<ProfileResult> {
    return await this.profileService.updateProfileByAdmin(input);
  }
}

import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Dashboard } from '../../libs/dto/analytics/analytics';
import { DashboardInquiry } from '../../libs/dto/analytics/analytics.input';
import { UserRole } from '../../libs/enums/user.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AnalyticsService } from './analytics.service';

@Resolver()
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /*** ADMIN ***/

  /** Admin home page: visitors, chart, top pages, sources, devices, to-dos. */
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => Dashboard)
  public async getDashboardByAdmin(
    @Args('input', { nullable: true }) input?: DashboardInquiry,
  ): Promise<Dashboard> {
    return await this.analyticsService.getDashboardByAdmin(input ?? {});
  }
}

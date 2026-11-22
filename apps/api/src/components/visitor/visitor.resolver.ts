import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { TrackVisitResult } from '../../libs/dto/visitor/visitor';
import { TrackVisitInput } from '../../libs/dto/visitor/visitor.input';
import type { GqlContext } from '../../libs/types/auth';
import { VisitorService } from './visitor.service';

@Resolver()
export class VisitorResolver {
  constructor(private readonly visitorService: VisitorService) {}

  /** Public: the frontend calls this on every page open. */
  @Mutation(() => TrackVisitResult)
  public async trackVisit(
    @Args('input') input: TrackVisitInput,
    @Context() { req, res }: GqlContext,
  ): Promise<TrackVisitResult> {
    return await this.visitorService.trackVisit(input, req, res);
  }
}

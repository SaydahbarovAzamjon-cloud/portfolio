import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TrackVisitResult {
  @Field(() => String)
  message: string;
}

import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/** Dashboard period: last N days (7 / 30 / 90 ...). */
@InputType()
export class DashboardInquiry {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  @Field(() => Int, { nullable: true, defaultValue: 30 })
  days?: number;
}

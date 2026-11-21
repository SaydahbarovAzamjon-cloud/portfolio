import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Health {
  @Field()
  status: string;

  @Field()
  database: string;

  @Field(() => Float, { description: 'Process uptime in seconds' })
  uptime: number;
}

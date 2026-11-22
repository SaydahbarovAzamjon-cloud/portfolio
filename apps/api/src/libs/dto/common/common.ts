import { Field, Int, ObjectType } from '@nestjs/graphql';

/** Shared GraphQL output types (mirror schemas/common.ts). */

@ObjectType()
export class LocalizedText {
  @Field(() => String)
  en: string;

  @Field(() => String, { nullable: true })
  ko?: string;
}

@ObjectType()
export class Media {
  @Field(() => String)
  url: string;

  @Field(() => LocalizedText, { nullable: true })
  alt?: LocalizedText;

  @Field(() => Int, { nullable: true })
  width?: number;

  @Field(() => Int, { nullable: true })
  height?: number;

  @Field(() => String, { nullable: true })
  blurDataUrl?: string;
}

@ObjectType()
export class IconCard {
  @Field(() => String)
  icon: string;

  @Field(() => LocalizedText)
  title: LocalizedText;

  @Field(() => LocalizedText, { nullable: true })
  description?: LocalizedText;
}

@ObjectType()
export class Stat {
  @Field(() => String)
  value: string;

  @Field(() => LocalizedText)
  label: LocalizedText;
}

/** Total count for paginated lists ($facet metaCounter). */
@ObjectType()
export class TotalCounter {
  @Field(() => Int)
  total: number;
}

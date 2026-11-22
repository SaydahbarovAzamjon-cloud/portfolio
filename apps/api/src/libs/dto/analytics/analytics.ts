import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DeviceType } from '../../enums/analytics.enum';
import { LocalizedText } from '../common/common';

/** One day on the chart (date in Asia/Seoul, "2026-11-22"). */
@ObjectType()
export class DailyPoint {
  @Field(() => String)
  date: string;

  @Field(() => Int)
  visitors: number;

  @Field(() => Int)
  pageViews: number;
}

/** A label and its count (top pages, sources, languages). */
@ObjectType()
export class CountItem {
  @Field(() => String)
  label: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class DeviceCount {
  @Field(() => DeviceType)
  type: DeviceType;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class TopArticle {
  @Field(() => String)
  slug: string;

  @Field(() => LocalizedText)
  title: LocalizedText;

  /** page views in the chosen period **/
  @Field(() => Int)
  views: number;

  @Field(() => Int)
  likeCount: number;

  @Field(() => Int)
  commentCount: number;
}

/** Admin dashboard: everything for the chosen period in one request. */
@ObjectType()
export class Dashboard {
  @Field(() => Int)
  days: number;

  /** unique visitors in the period **/
  @Field(() => Int)
  visitors: number;

  /** first-time visitors in the period **/
  @Field(() => Int)
  newVisitors: number;

  /** visits (a visit ends after 30 min without a page open) **/
  @Field(() => Int)
  visits: number;

  @Field(() => Int)
  pageViews: number;

  @Field(() => Int)
  totalVisitors: number;

  /** to-do badges **/
  @Field(() => Int)
  newMessages: number;

  @Field(() => Int)
  pendingComments: number;

  @Field(() => [DailyPoint])
  daily: DailyPoint[];

  @Field(() => [CountItem])
  topPages: CountItem[];

  /** where visits came from: hostname or "direct" **/
  @Field(() => [CountItem])
  sources: CountItem[];

  @Field(() => [CountItem])
  languages: CountItem[];

  @Field(() => [DeviceCount])
  devices: DeviceCount[];

  @Field(() => [TopArticle])
  topArticles: TopArticle[];
}

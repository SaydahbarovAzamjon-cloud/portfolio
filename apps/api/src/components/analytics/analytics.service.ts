import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CountItem,
  DailyPoint,
  Dashboard,
  DeviceCount,
  TopArticle,
} from '../../libs/dto/analytics/analytics';
import { DashboardInquiry } from '../../libs/dto/analytics/analytics.input';
import { PageType } from '../../libs/enums/analytics.enum';
import { CommentStatus } from '../../libs/enums/comment.enum';
import { ContactMessageStatus } from '../../libs/enums/contact.enum';

const TIMEZONE = 'Asia/Seoul';
const DAY_MS = 24 * 60 * 60 * 1000;
const TOP_LIMIT = 10;

interface PageViewFacet {
  totals: { pageViews: number; visitors: string[]; visits: string[] }[];
  daily: { _id: string; pageViews: number; visitors: string[] }[];
  topPages: { _id: string; count: number }[];
  sources: { _id: string | null; count: number }[];
  languages: { _id: string; count: number }[];
  topArticles: TopArticle[];
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel('PageView') private readonly pageViewModel: Model<unknown>,
    @InjectModel('Visitor') private readonly visitorModel: Model<unknown>,
    @InjectModel('Comment') private readonly commentModel: Model<unknown>,
    @InjectModel('ContactMessage')
    private readonly contactModel: Model<unknown>,
  ) {}

  public async getDashboardByAdmin(
    input: DashboardInquiry,
  ): Promise<Dashboard> {
    const days = input.days ?? 30;
    const since = this.startOfPeriod(days);

    // 1. everything from page views in one aggregation
    const [views] = await this.pageViewModel
      .aggregate<PageViewFacet>([
        { $match: { createdAt: { $gte: since } } },
        {
          $facet: {
            totals: [
              {
                $group: {
                  _id: null,
                  pageViews: { $sum: 1 },
                  visitors: { $addToSet: '$visitorId' },
                  visits: { $addToSet: '$sessionId' },
                },
              },
            ],
            daily: [
              {
                $group: {
                  _id: {
                    $dateToString: {
                      date: '$createdAt',
                      format: '%Y-%m-%d',
                      timezone: TIMEZONE,
                    },
                  },
                  pageViews: { $sum: 1 },
                  visitors: { $addToSet: '$visitorId' },
                },
              },
            ],
            topPages: [
              { $group: { _id: '$path', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
              { $limit: TOP_LIMIT },
            ],
            // the first page of each visit tells where the visit came from
            sources: [
              { $sort: { createdAt: 1 } },
              {
                $group: {
                  _id: '$sessionId',
                  referrer: { $first: '$referrer' },
                },
              },
              { $group: { _id: '$referrer', count: { $sum: 1 } } },
            ],
            languages: [
              { $group: { _id: '$locale', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
            ],
            topArticles: [
              {
                $match: { pageType: PageType.ARTICLE, entityId: { $ne: null } },
              },
              { $group: { _id: '$entityId', views: { $sum: 1 } } },
              { $sort: { views: -1 } },
              { $limit: TOP_LIMIT },
              {
                $lookup: {
                  from: 'articles',
                  localField: '_id',
                  foreignField: '_id',
                  as: 'article',
                },
              },
              { $unwind: '$article' },
              {
                $project: {
                  _id: 0,
                  views: 1,
                  slug: '$article.slug',
                  title: '$article.title',
                  likeCount: '$article.likeCount',
                  commentCount: '$article.commentCount',
                },
              },
            ],
          },
        },
      ])
      .exec();

    // 2. visitor and to-do counts
    const [totalVisitors, newVisitors, devices, newMessages, pendingComments] =
      await Promise.all([
        this.visitorModel.countDocuments().exec(),
        this.visitorModel
          .countDocuments({ firstSeenAt: { $gte: since } })
          .exec(),
        this.visitorModel
          .aggregate<DeviceCount>([
            { $match: { lastSeenAt: { $gte: since } } },
            { $group: { _id: '$device.type', count: { $sum: 1 } } },
            { $project: { _id: 0, type: '$_id', count: 1 } },
            { $sort: { count: -1 } },
          ])
          .exec(),
        this.contactModel
          .countDocuments({ status: ContactMessageStatus.NEW })
          .exec(),
        this.commentModel
          .countDocuments({ status: CommentStatus.PENDING })
          .exec(),
      ]);

    const totals = views?.totals[0];
    return {
      days,
      visitors: totals?.visitors.length ?? 0,
      newVisitors,
      visits: totals?.visits.length ?? 0,
      pageViews: totals?.pageViews ?? 0,
      totalVisitors,
      newMessages,
      pendingComments,
      daily: this.fillDays(days, views?.daily ?? []),
      topPages: (views?.topPages ?? []).map((p) => ({
        label: p._id,
        count: p.count,
      })),
      sources: this.groupSources(views?.sources ?? []),
      languages: (views?.languages ?? []).map((l) => ({
        label: l._id,
        count: l.count,
      })),
      devices: devices.filter((d) => d.type),
      topArticles: views?.topArticles ?? [],
    };
  }

  /*** HELPERS ***/

  /** Midnight (Seoul) of the first day: days=7 → today and the 6 days before. */
  private startOfPeriod(days: number): Date {
    const todayInSeoul = this.seoulDate(new Date());
    const midnight = new Date(`${todayInSeoul}T00:00:00+09:00`);
    return new Date(midnight.getTime() - (days - 1) * DAY_MS);
  }

  /** "YYYY-MM-DD" in Seoul time. */
  private seoulDate(date: Date): string {
    return date.toLocaleDateString('en-CA', { timeZone: TIMEZONE });
  }

  /** One point per day, 0 for days without visits (for a smooth chart). */
  private fillDays(
    days: number,
    rows: { _id: string; pageViews: number; visitors: string[] }[],
  ): DailyPoint[] {
    const byDate = new Map(rows.map((r) => [r._id, r]));
    const start = this.startOfPeriod(days).getTime();

    return Array.from({ length: days }, (_, i) => {
      const date = this.seoulDate(new Date(start + i * DAY_MS + DAY_MS / 2));
      const row = byDate.get(date);
      return {
        date,
        visitors: row?.visitors.length ?? 0,
        pageViews: row?.pageViews ?? 0,
      };
    });
  }

  /** Full referrer URLs → hostnames ("www.google.com"), "direct" when empty. */
  private groupSources(
    rows: { _id: string | null; count: number }[],
  ): CountItem[] {
    const counts = new Map<string, number>();
    for (const row of rows) {
      const label = this.hostname(row._id);
      counts.set(label, (counts.get(label) ?? 0) + row.count);
    }
    return [...counts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, TOP_LIMIT);
  }

  private hostname(referrer: string | null): string {
    if (!referrer) return 'direct';
    try {
      return new URL(referrer).hostname.replace(/^www\./, '');
    } catch {
      return 'unknown';
    }
  }
}

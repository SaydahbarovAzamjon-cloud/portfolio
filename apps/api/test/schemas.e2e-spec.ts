import mongoose, { Connection, Model, Schema } from 'mongoose';
import ArticleSchema from '../src/schemas/Article.model';
import AuthSessionSchema from '../src/schemas/AuthSession.model';
import CommentSchema from '../src/schemas/Comment.model';
import ContactMessageSchema from '../src/schemas/ContactMessage.model';
import EducationSchema from '../src/schemas/Education.model';
import ExperienceSchema from '../src/schemas/Experience.model';
import LikeSchema from '../src/schemas/Like.model';
import PageViewSchema from '../src/schemas/PageView.model';
import ProfileSchema from '../src/schemas/Profile.model';
import ProjectSchema from '../src/schemas/Project.model';
import SkillCategorySchema from '../src/schemas/SkillCategory.model';
import SkillSchema from '../src/schemas/Skill.model';
import UploadSchema from '../src/schemas/Upload.model';
import UserSchema from '../src/schemas/User.model';
import VisitorSchema from '../src/schemas/Visitor.model';

// MongoDB runs in memory, started by test/global-setup.ts.
const SCHEMAS: Record<string, Schema> = {
  User: UserSchema,
  AuthSession: AuthSessionSchema,
  Profile: ProfileSchema,
  Education: EducationSchema,
  Experience: ExperienceSchema,
  SkillCategory: SkillCategorySchema,
  Skill: SkillSchema,
  Project: ProjectSchema,
  Article: ArticleSchema,
  Comment: CommentSchema,
  Like: LikeSchema,
  ContactMessage: ContactMessageSchema,
  Visitor: VisitorSchema,
  PageView: PageViewSchema,
  Upload: UploadSchema,
};

describe('Mongoose schemas (data model)', () => {
  let conn: Connection;
  /** Untyped on purpose: this suite checks every schema generically. */
  type AnyDoc = Record<string, unknown>;
  const m = (name: string): Model<AnyDoc> => conn.model<AnyDoc>(name);

  /** Field paths that failed validation (empty when the document is valid). */
  const invalidPaths = async (doc: {
    validate(): Promise<void>;
  }): Promise<string[]> => {
    try {
      await doc.validate();
      return [];
    } catch (e) {
      return Object.keys((e as mongoose.Error.ValidationError).errors);
    }
  };

  beforeAll(async () => {
    conn = await mongoose
      .createConnection(process.env.MONGODB_URI as string, {
        dbName: 'schemas-test',
      })
      .asPromise();
    for (const [name, schema] of Object.entries(SCHEMAS)) {
      conn.model(name, schema);
    }
    await Promise.all(Object.keys(SCHEMAS).map((n) => m(n).syncIndexes()));
  });

  afterAll(async () => {
    await conn?.dropDatabase();
    await conn?.close();
  });

  it('creates every collection with its expected name', async () => {
    const names = (await conn.listCollections()).map((c) => c.name).sort();
    expect(names).toEqual(
      [
        'articles',
        'auth_sessions',
        'comments',
        'contact_messages',
        'education',
        'experiences',
        'likes',
        'page_views',
        'profile',
        'projects',
        'skill_categories',
        'skills',
        'uploads',
        'users',
        'visitors',
      ].sort(),
    );
  });

  it('auth sessions expire through a TTL index', async () => {
    const indexes = await m('AuthSession').collection.indexes();
    const ttl = indexes.find((i) => i.key.expiresAt === 1);
    expect(ttl?.expireAfterSeconds).toBe(0);
  });

  it('users: email unique + lowercased, password hidden by default', async () => {
    await m('User').create({ email: 'Admin@Example.com', passwordHash: 'x' });
    await expect(
      m('User').create({ email: 'admin@example.com', passwordHash: 'y' }),
    ).rejects.toThrow(/duplicate key/);

    const found = await m('User').findOne({ email: 'admin@example.com' });
    expect(found?.get('role')).toBe('ADMIN');
    expect(found?.get('passwordHash')).toBeUndefined();
  });

  it('profile is a singleton', async () => {
    const base = {
      name: 'AZAMJON',
      fullName: { en: 'Azamjon Saydahbarov' },
      headline: { en: 'Full-Stack Developer · AI Engineer' },
      location: {
        city: { en: 'Busan', ko: '부산' },
        country: { en: 'South Korea', ko: '대한민국' },
      },
      contactEmail: 'owner@example.com',
    };
    const profile = await m('Profile').create(base);
    expect(profile.get('location.timezone')).toBe('Asia/Seoul');
    await expect(m('Profile').create(base)).rejects.toThrow(/duplicate key/);
  });

  it('localized text requires English, Korean is optional', async () => {
    const doc = new (m('Education'))({
      degree: 'MASTER',
      institution: { ko: '인제대학교' },
      startDate: new Date('2025-03-01'),
      status: 'IN_PROGRESS',
    });
    expect(await invalidPaths(doc)).toContain('institution.en');
  });

  it('rejects unknown enum values', async () => {
    const doc = new (m('Project'))({
      slug: 'fixora',
      title: 'Fixora',
      subtitle: { en: 'Apple device repair marketplace' },
      summary: { en: 'Marketplace' },
      category: 'BLOCKCHAIN',
    });
    expect(await invalidPaths(doc)).toContain('category');
  });

  it('projects: slug must be URL-safe and unique', async () => {
    const project = {
      title: 'Lumora',
      subtitle: { en: 'AI personal stylist platform' },
      summary: { en: 'AI stylist' },
      category: 'AI_ML',
      status: 'IN_PROGRESS',
    };
    expect(
      await invalidPaths(new (m('Project'))({ ...project, slug: 'Bad Slug!' })),
    ).toContain('slug');

    await m('Project').create({ ...project, slug: 'lumora' });
    await expect(
      m('Project').create({ ...project, slug: 'lumora' }),
    ).rejects.toThrow(/duplicate key/);
  });

  it('articles: reading time and publish date are computed', async () => {
    const words = Array.from({ length: 450 }, () => 'word').join(' ');
    const article = await m('Article').create({
      slug: 'how-i-built-fixora',
      title: { en: 'How I Built Fixora' },
      excerpt: { en: 'From idea to MVP' },
      content: { en: words },
      category: 'DEVELOPMENT',
      status: 'PUBLISHED',
    });
    expect(article.get('readingTime.en')).toBe(3);
    expect(article.get('readingTime.ko')).toBeUndefined();
    expect(article.get('publishedAt')).toBeInstanceOf(Date);
    expect(article.get('translation.ko.status')).toBe('NONE');
  });

  it('articles: only the four journal categories are allowed', async () => {
    const doc = new (m('Article'))({
      slug: 'x',
      title: { en: 'x' },
      excerpt: { en: 'x' },
      content: { en: 'x' },
      category: 'NEWS',
    });
    expect(await invalidPaths(doc)).toContain('category');
  });

  it('comments start as PENDING and hide private fields', async () => {
    const article = await m('Article').create({
      slug: 'comment-target',
      title: { en: 't' },
      excerpt: { en: 'e' },
      content: { en: 'c' },
      category: 'PERSONAL',
    });
    await m('Comment').create({
      articleId: article._id,
      authorName: 'Visitor',
      authorEmail: 'v@example.com',
      content: 'Great post',
      ipHash: 'hash',
    });
    const comment = await m('Comment').findOne({ articleId: article._id });
    expect(comment?.get('status')).toBe('PENDING');
    expect(comment?.get('authorEmail')).toBeUndefined();
    expect(comment?.get('ipHash')).toBeUndefined();
  });

  it('likes: one per visitor per article', async () => {
    const article = await m('Article').create({
      slug: 'like-target',
      title: { en: 't' },
      excerpt: { en: 'e' },
      content: { en: 'c' },
      category: 'AI_ML',
    });
    await m('Like').create({ articleId: article._id, visitorId: 'v1' });
    await expect(
      m('Like').create({ articleId: article._id, visitorId: 'v1' }),
    ).rejects.toThrow(/duplicate key/);
    await expect(
      m('Like').create({ articleId: article._id, visitorId: 'v2' }),
    ).resolves.toBeDefined();
  });

  it('contact messages enforce length limits', async () => {
    const doc = new (m('ContactMessage'))({
      name: 'A',
      email: 'a@example.com',
      subject: 'Hi',
      message: 'short',
    });
    expect(await invalidPaths(doc)).toContain('message');
  });

  it('experience endDate defaults to null (current position)', async () => {
    const doc = new (m('Experience'))({
      company: 'NGroup',
      role: { en: 'Full-Stack & AI Developer' },
      startDate: new Date('2025-01-01'),
    });
    expect(await invalidPaths(doc)).toEqual([]);
    expect(doc.get('endDate')).toBeNull();
    expect(doc.get('employmentType')).toBe('FULL_TIME');
  });
});

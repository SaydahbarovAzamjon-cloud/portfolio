import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

interface GqlResponse<T = Record<string, unknown>> {
  data?: T;
  errors?: { message: string; extensions?: { code?: string } }[];
}

// MongoDB runs in memory, started by test/global-setup.ts.
describe('GraphQL API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('health query reports API and database up', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: '{ health { status database uptime } }' })
      .expect(200);

    const body = res.body as GqlResponse<{ health: unknown }>;
    expect(body.errors).toBeUndefined();
    expect(body.data?.health).toMatchObject({
      status: 'ok',
      database: 'up',
    });
  });

  it('rejects invalid queries with a validation error', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: '{ doesNotExist }' })
      .expect(400);

    const body = res.body as GqlResponse;
    expect(body.errors?.[0]?.extensions?.code).toBe(
      'GRAPHQL_VALIDATION_FAILED',
    );
  });
});

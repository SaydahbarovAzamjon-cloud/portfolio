import { Test } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { ConnectionStates } from 'mongoose';
import { HealthResolver } from './health.resolver';

describe('HealthResolver', () => {
  async function createResolver(readyState: ConnectionStates) {
    const moduleRef = await Test.createTestingModule({
      providers: [
        HealthResolver,
        { provide: getConnectionToken(), useValue: { readyState } },
      ],
    }).compile();
    return moduleRef.get(HealthResolver);
  }

  it('reports ok when the database is connected', async () => {
    const resolver = await createResolver(ConnectionStates.connected);
    expect(resolver.health()).toMatchObject({ status: 'ok', database: 'up' });
  });

  it('reports degraded when the database is disconnected', async () => {
    const resolver = await createResolver(ConnectionStates.disconnected);
    expect(resolver.health()).toMatchObject({
      status: 'degraded',
      database: 'down',
    });
  });
});

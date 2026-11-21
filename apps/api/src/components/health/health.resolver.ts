import { Query, Resolver } from '@nestjs/graphql';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';
import { Health } from '../../libs/dto/health/health';

@Resolver(() => Health)
export class HealthResolver {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Query(() => Health, { description: 'API and database status' })
  health(): Health {
    const dbUp = this.connection.readyState === ConnectionStates.connected;
    return {
      status: dbUp ? 'ok' : 'degraded',
      database: dbUp ? 'up' : 'down',
      uptime: process.uptime(),
    };
  }
}

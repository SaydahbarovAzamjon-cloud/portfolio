// Must be the first import: prints any startup error in red.
import { printStartupError, printStartupSuccess } from './libs/startup';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import cookieParser from 'cookie-parser';
import { Connection } from 'mongoose';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';

async function bootstrap() {
  // abortOnError: false → startup errors reach our red error message below.
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  const config = app.get(ConfigService);

  // Auth tokens travel in httpOnly cookies.
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Development: print every GraphQL request/response in the terminal.
  if (config.get<string>('NODE_ENV') !== 'production') {
    app.useGlobalInterceptors(new LoggingInterceptor());
  }

  app.enableCors({
    origin: config.getOrThrow<string>('FRONTEND_URL'),
    credentials: true,
  });

  app.enableShutdownHooks();

  const port = config.getOrThrow<number>('PORT');
  await app.listen(port);

  const db = app.get<Connection>(getConnectionToken());
  printStartupSuccess([
    `Backend successfully running on port ${port}`,
    `GraphQL:     http://localhost:${port}/graphql`,
    `MongoDB:     connected (${db.name})`,
    `Environment: ${config.get<string>('NODE_ENV')}`,
  ]);
}

bootstrap().catch((error: unknown) => {
  printStartupError(error);
  process.exit(1);
});

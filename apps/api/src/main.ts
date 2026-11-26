// Must be the first import: prints any startup error in red.
import { printStartupError, printStartupSuccess } from './libs/startup';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { getConnectionToken } from '@nestjs/mongoose';
import cookieParser from 'cookie-parser';
import type { ServerResponse } from 'node:http';
import { resolve } from 'node:path';
import { Connection } from 'mongoose';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';

async function bootstrap() {
  // abortOnError: false → startup errors reach our red error message below.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
  });
  const config = app.get(ConfigService);

  // Production runs behind Nginx: read the visitor's real IP from X-Forwarded-For
  // (otherwise every visitor looks like 127.0.0.1 and shares one rate limit).
  if (config.get<string>('NODE_ENV') === 'production') {
    app.set('trust proxy', 1);
  }

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

  // Uploaded files: APP_URL/uploads/... (on the VPS Nginx can serve this folder directly).
  // CORS lets the site fetch a file and save it with a readable name (resume / portfolio download).
  const frontendUrl = config.getOrThrow<string>('FRONTEND_URL');
  app.useStaticAssets(resolve(config.getOrThrow<string>('UPLOAD_DIR')), {
    prefix: '/uploads/',
    index: false,
    maxAge: '30d',
    setHeaders: (res: ServerResponse) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Access-Control-Allow-Origin', frontendUrl);
    },
  });

  app.enableCors({
    origin: frontendUrl,
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

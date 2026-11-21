import { MongoMemoryServer } from 'mongodb-memory-server';

declare global {
  var __MONGO__: MongoMemoryServer | undefined;
}

/**
 * Starts an in-memory MongoDB before any e2e test file is loaded,
 * so env validation in AppModule sees MONGODB_URI.
 */
export default async function globalSetup(): Promise<void> {
  const mongo = await MongoMemoryServer.create();
  globalThis.__MONGO__ = mongo;
  process.env.MONGODB_URI = mongo.getUri('portfolio-test');
  process.env.NODE_ENV = 'test';
}

import { LoadStrategy } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { SqliteDriver } from '@mikro-orm/sqlite';

const mikroOrmConfig: MikroOrmModuleOptions = {
  driver: SqliteDriver,
  dbName: process.env.DB_NAME || 'user-transactions.sqlite3',
  debug: process.env.NODE_ENV === 'development',
  loadStrategy: LoadStrategy.JOINED,
  highlighter: new SqlHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  migrations: {
    disableForeignKeys: false,
    path: './dist/migrations',
    pathTs: './src/migrations',
  },
  extensions: [Migrator],
};

export default mikroOrmConfig;

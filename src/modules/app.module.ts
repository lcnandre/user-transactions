import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TransactionModule } from './transaction.module';
import config, { schema as configSchema } from '../config/app.config';

/**
 * Main app module that holds the root configuration.
 *
 * @export
 * @class AppModule
 * @typedef {AppModule}
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: configSchema,
    }),
    MikroOrmModule.forRoot(),
    TransactionModule,
  ],
})
export class AppModule {}

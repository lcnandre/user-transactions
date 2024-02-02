import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TransactionModule } from './transaction.module';
import config, { schema as configSchema } from '../config/config';
import mikroOrmConfig from '../config/mikro-orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: configSchema,
    }),
    MikroOrmModule.forRootAsync({
      ...mikroOrmConfig,
    }),
    TransactionModule,
  ],
})
export class AppModule {}

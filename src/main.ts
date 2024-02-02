import helmet from '@fastify/helmet';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const configService: ConfigService<
    {
      app: {
        port: number;
      };
    },
    true
  > = app.get(ConfigService);
  const appConfig = configService.get('app', { infer: true });

  // Middlewares
  app.enableCors();
  await app.register(helmet);

  await app.listen(appConfig.port, '0.0.0.0');
}

bootstrap();

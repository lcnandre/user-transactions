import helmet from '@fastify/helmet';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './modules/app.module';

async function bootstrap() {
  // Setup Fastify app
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  // Fetch app configuration from environment variables.
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

  // Hosting
  await app.listen(appConfig.port, '0.0.0.0');
}

bootstrap();

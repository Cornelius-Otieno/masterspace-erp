import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const corsOrigin = config.get<string>('CORS_ORIGIN') ?? 'http://localhost:5173';
  const allowedOrigins = new Set([
    corsOrigin,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ]);
  app.enableCors({
    origin: (origin, callback) => {
      const isVercelDeployment = /^https:\/\/frontend(?:-[a-z0-9-]+)?-dangco\.vercel\.app$/.test(origin ?? '');
      callback(null, !origin || allowedOrigins.has(origin) || isVercelDeployment);
    },
    credentials: true,
  });

  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`🚀 Masterspace ERP API running on http://localhost:${port}/api`);
}
bootstrap();

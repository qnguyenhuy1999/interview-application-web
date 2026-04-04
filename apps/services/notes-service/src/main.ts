/**
 * MONOLITH (Before): NotesModule embedded in main NestJS app
 * MICROSERVICES (After): Standalone Notes Service with its own deployment unit
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3003;
  await app.listen(port);
  console.log(`Notes Service running on http://localhost:${port}`);
}

bootstrap();

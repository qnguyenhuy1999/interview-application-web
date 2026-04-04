/**
 * MONOLITH (Before): AiModule embedded in main NestJS app
 * MICROSERVICES (After): Standalone AI Service with caching and retry logic
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true });
  const port = process.env.PORT || 3005;
  await app.listen(port);
  console.log(`AI Service running on http://localhost:${port}`);
}
bootstrap();
